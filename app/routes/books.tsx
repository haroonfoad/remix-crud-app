import { db } from "~/drizzle/db";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "~/drizzle/bookModelDrizzle";
import BookModal from "~/components/BookModal";

export async function loader() {
  console.log("loader called");
  const allBooks = await getAllBooks();
  return Response.json({ books: allBooks });
}

export async function action({ request }: { request: Request }) {
  console.log("action called");
  const formData = await request.formData();

  if (formData.get("_method") === "delete") {
    const bookId = formData.get("bookId");
    await deleteBook(Number(bookId));
    return Response.json({ success: true });
  } else if (formData.get("_method") === "edit") {
    const updatedBook = JSON.parse((formData.get("book") as string) || "{}");
    await updateBook(updatedBook);
    return Response.json({ success: true });
  } else if (formData.get("_method") === "add") {
    const addedBook = JSON.parse((formData.get("book") as string) || "{}");
    await addBook(addedBook);
    return Response.json({ success: true });
  }

  throw new Error("Invalid action.");
}
export default function books() {
  console.log("books called");
  const { books } = useLoaderData<{ books: any[] }>();
  const fetcher = useFetcher();
  const [currentBook, setCurrentBook] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id: number) => {
    fetcher.submit(
      { bookId: id, _method: "delete" },
      { method: "post", action: "/books" }
    );
  };

  const handleAddClick = () => {
    const newBook = {
      id: null,
      book_name: "",
      author: "",
      publishing_year: null,
      ISBN: null,
    };
    setCurrentBook(newBook);
    setShowModal(true);
  };

  const handleEditClick = (book: any) => {
    setCurrentBook(book);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setCurrentBook(null);
    setShowModal(false);
  };

  const handleFormSubmit = (updatedBook: any) => {
    const formData = new FormData();
    formData.append("_method", updatedBook.id ? "edit" : "add");
    formData.append("book", JSON.stringify(updatedBook));

    fetcher.submit(formData, { method: "post", action: "/books" });
    setShowModal(false);
  };

  return (
    <>
      <h1>Books Management</h1>
      <h2>
        <button
          className="btn btn-outline-success"
          onClick={() => handleAddClick()}
        >
          New Book
        </button>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Publishing Year</th>
            <th>ISBN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.book_name}</td>
              <td>{book.author}</td>
              <td>{book.publishing_year}</td>
              <td>{book.ISBN}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditClick(book)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BookModal
        isOpen={showModal}
        onClose={handleModalClose}
        currentBook={currentBook}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
