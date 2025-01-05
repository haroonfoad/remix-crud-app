import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
    id: integer("id").primaryKey(),
    book_name: text("book_name").notNull(),
    author: text("author").notNull(),
    publishing_year: integer("publishing_year"),
    ISBN: text("ISBN").unique().notNull(),
  });