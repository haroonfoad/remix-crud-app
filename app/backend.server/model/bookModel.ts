// This file uses direct query using pg client. no drizzle is used here
import { query } from "~/utils/db.server";

export interface Book {
  id: number;
  book_name: string;
  author: string;
  publishing_year: string;
  ISBN: string;
}

export async function getBooks(): Promise<Book[]> {
  const result = await query('SELECT * FROM books order by id');
  return result.rows;
}

export async function deleteBook(bookId: number){
  const result=await query('DELETE FROM books where id=$1', [bookId])
  return result;
  
}

export async function updateBook(book: Book){
  const result=await query(`UPDATE books SET book_name=$1, 
    author=$2, publishing_year=$3, "ISBN"=$4 where id=$5`, 
    [book.book_name,book.author,book.publishing_year,book.ISBN,book.id])

  return result;
  
}

export async function addBook(book: Book){
  const maxId=await query('select max(id) from books')
  const maxIdValue=Number(maxId.rows[0].max)+1

  const result=await query(`INSERT INTO books values($1,$2,$3,$4,$5)`, 
    [maxIdValue,book.book_name,book.author,book.publishing_year,book.ISBN])

  return maxId.rows;
  
}
