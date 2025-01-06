import { useEffect, useState } from "react";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: any) => void;
  currentBook: any;
}

export default function BookModal({
  isOpen,
  onClose,
  onSubmit,
  currentBook,
}: BookModalProps) {
  const [book, setBook] = useState(currentBook);

  // Update the local state when `currentBook` changes
  useEffect(() => {
    setBook(currentBook);
  }, [currentBook]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newBook = { ...book, [name]: value };
    setBook(newBook);
  };

  const handleSubmit = () => {
    onSubmit(book);
  };

  return (
    <>
      <div
        className="modal show"
        tabIndex={-1}
        style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {currentBook.id ? "Edit Book" : "Add Book"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <form>
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
                    value={book?.book_name || ""}
                    onChange={handleInputChange}
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
                    value={book?.author || ""}
                    onChange={handleInputChange}
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
                    value={book?.publishing_year || ""}
                    onChange={handleInputChange}
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
                    value={book?.ISBN || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
