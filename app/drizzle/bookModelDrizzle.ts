import { eq } from "drizzle-orm";
import {db} from "./db"
import { books } from "~/drizzle/schema";


export async function getAllBooks(){
  return await db.select().from(books).orderBy(books.id) || []
}

export async function deleteBook(bookId: number){
  return await db.delete(books).where(eq(books.id,bookId))
}

export async function updateBook(updatedBook:any){
  return db
  .update(books)
  .set({
    book_name:updatedBook.book_name,
    author:updatedBook.author,
    publishing_year:updatedBook.publishing_year,
    ISBN:updatedBook.ISBN
  })
  .where(eq(books.id,updatedBook.id))
  
}

export async function addBook(newBook: any){
  const maxId=await db.execute('select max(id) from books')
  const newBookId=Number(maxId.rows[0].max)+1

  await db.insert(books).values({
    id:newBookId,
    book_name:newBook.book_name,
    author:newBook.author,
    publishing_year:newBook.publishing_year,
    ISBN: newBook.ISBN
  })
  return maxId.rows;
  
}
