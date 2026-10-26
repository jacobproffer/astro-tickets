import { createClient } from "@sanity/client";
import matter from "gray-matter";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectId = "lf1rig2j";
const dataset = "production";
const sourceDirectory = fileURLToPath(
  new URL("../src/content/tickets/", import.meta.url),
);
const dryRun = process.argv.includes("--dry-run");

const sourceFiles = (await readdir(sourceDirectory))
  .filter((file) => file.endsWith(".md"))
  .sort();
const tickets = await Promise.all(
  sourceFiles.map(async (file) => {
    const { data } = matter(
      await readFile(join(sourceDirectory, file), "utf8"),
    );
    const sourceId = basename(file, ".md");
    const date = String(data.date ?? "");
    const price = Number(data.price);

    if (
      !data.title ||
      !data.theater ||
      !data.rating ||
      !Number.isFinite(price) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
    ) {
      throw new Error(`Invalid ticket frontmatter in ${file}`);
    }

    return {
      sourceId,
      title: String(data.title),
      date,
      price,
      theater: String(data.theater),
      rating: String(data.rating),
      ...(data.international !== undefined && {
        international: Boolean(data.international),
      }),
      ...(data.rerelease !== undefined && {
        rerelease: Boolean(data.rerelease),
      }),
    };
  }),
);

if (dryRun) {
  console.log(`Validated ${tickets.length} ticket files; no Sanity documents changed.`);
  process.exit(0);
}

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  throw new Error(
    "Set SANITY_API_TOKEN to a Sanity token with write access to the production dataset.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-02-19",
  useCdn: false,
  token,
});

const sourceIds = tickets.map((ticket) => ticket.sourceId);
const existingDocuments = await client.fetch(
  '*[_type == "ticket" && sourceId in $sourceIds]{_id, sourceId}',
  { sourceIds },
);
const existingBySourceId = new Map(
  existingDocuments.map((document) => [document.sourceId, document._id]),
);
let created = 0;
let updated = 0;

for (let index = 0; index < tickets.length; index += 50) {
  const transaction = client.transaction();

  for (const ticket of tickets.slice(index, index + 50)) {
    const documentId = existingBySourceId.get(ticket.sourceId);
    if (documentId) {
      transaction.patch(documentId, (patch) => patch.set(ticket));
      updated += 1;
    } else {
      transaction.create({ _type: "ticket", ...ticket });
      created += 1;
    }
  }

  await transaction.commit();
}

console.log(`Imported ${tickets.length} tickets (${created} created, ${updated} updated).`);
