# Deadman's Brew

Made with Astro and Tailwind.

## Sanity content

Movie tickets are read from the `production` dataset in Sanity project
`lf1rig2j`. The Astro app fetches them at build time; the Studio remains
standalone in the sibling `studio-ticket-site` folder.

To run the Studio locally, use `npm run dev` from `studio-ticket-site`. To
import or update the existing Markdown tickets in Sanity, create an API token
with write access to the dataset, then run this from `astro-tickets`:

```sh
SANITY_API_TOKEN=<token> npm run migrate:tickets
```

The importer validates the Markdown frontmatter, matches existing documents by
their original file name, and creates or updates them without assigning
deterministic Sanity document IDs. Preview validation without writing with:

```sh
npm run migrate:tickets -- --dry-run
```

Keep the API token private and do not commit it. After importing, `npm run build`
fetches tickets from Sanity for the homepage, ticket archive, search,
theater/rating pages, and collection statistics.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
