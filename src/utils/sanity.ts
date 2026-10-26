import { defineQuery } from "groq";
import { sanityClient } from "sanity:client";

export interface Ticket {
  _id: string;
  sourceId?: string;
  title: string;
  date: string;
  price: number;
  theater: string;
  rating: string;
  international?: boolean;
  rerelease?: boolean;
}

const TICKETS_QUERY = defineQuery(`
  *[_type == "ticket"] | order(date desc) {
    _id,
    sourceId,
    title,
    date,
    price,
    theater,
    rating,
    international,
    rerelease
  }
`);

export function getTickets(): Promise<Ticket[]> {
  return sanityClient.fetch<Ticket[]>(TICKETS_QUERY);
}

export function getTicketDate(ticket: Pick<Ticket, "date">): Date {
  return new Date(`${ticket.date}T00:00:00`);
}
