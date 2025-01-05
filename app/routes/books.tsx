import { db } from "~/drizzle/db";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "~/drizzle/bookModelDrizzle";

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
  console.log("Books in component:", books);
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentBook) return;

    const formData = new FormData(e.currentTarget);
    formData.append("_method", "edit");
    formData.append("book", JSON.stringify(currentBook));

    fetcher.submit(formData, { method: "post", action: "/books" });
    setShowModal(false);
  };

  const handleAddFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentBook) return;

    const formData = new FormData(e.currentTarget);
    formData.append("_method", "add");
    formData.append("book", JSON.stringify(currentBook));

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
            <th>ISBN</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Publishing Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.ISBN}</td>
              <td>{book.book_name}</td>
              <td>{book.author}</td>
              <td>{book.publishing_year}</td>
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

      {/* Modal Edit*/}
      {showModal && currentBook && (
        <div
          className="modal show"
          tabIndex={-1}
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="book_name" className="form-label">
                      Book Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="book_name"
                      name="book_name"
                      value={currentBook.book_name}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          book_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                      Author
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="author"
                      name="author"
                      value={currentBook.author}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          author: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="publishing_year" className="form-label">
                      Publishing Year
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="publishing_year"
                      name="publishing_year"
                      value={currentBook.publishing_year}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          publishing_year: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ISBN" className="form-label">
                      ISBN
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ISBN"
                      name="ISBN"
                      value={currentBook.ISBN}
                      onChange={(e) =>
                        setCurrentBook({ ...currentBook, ISBN: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add*/}
      {showModal && currentBook?.id === null && (
        <div
          className="modal show"
          tabIndex={-1}
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Book</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <form onSubmit={handleAddFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="book_name" className="form-label">
                      Book Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="book_name"
                      name="book_name"
                      value={currentBook.book_name}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          book_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                      Author
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="author"
                      name="author"
                      value={currentBook.author}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          author: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="publishing_year" className="form-label">
                      Publishing Year
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="publishing_year"
                      name="publishing_year"
                      value={currentBook.publishing_year}
                      onChange={(e) =>
                        setCurrentBook({
                          ...currentBook,
                          publishing_year: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ISBN" className="form-label">
                      ISBN
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ISBN"
                      name="ISBN"
                      value={currentBook.ISBN}
                      onChange={(e) =>
                        setCurrentBook({ ...currentBook, ISBN: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
