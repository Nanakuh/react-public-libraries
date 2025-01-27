import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BookCard from "./BookCard";

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(20); // Ahora es dinámico

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setApiError(null);

      try {
        const response = await fetch(
          "https://openlibrary.org/search.json?q=book"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const booksReadyForUI = data.docs.map((book) => ({
          key: book.key || Math.random().toString(),
          title: book.title || "Unknown Title",
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "https://via.placeholder.com/150",
          author:
            Array.isArray(book.author_name) && book.author_name.length > 0
              ? book.author_name[0]
              : "Unknown",
        }));

        setBooks(booksReadyForUI);
      } catch (e) {
        setApiError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const goToNextPage = () => {
    if (currentPage < Math.ceil(books.length / booksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Header />
      <main className='book-list'>
        {loading && <p className='loading-message'>Loading books...</p>}
        {apiError && <p className='error-message'>{apiError}</p>}
        {!loading &&
          !apiError &&
          currentBooks.map((book) => (
            <BookCard
              key={book.key}
              title={book.title}
              author={book.author}
              cover={book.cover}
            />
          ))}

        {!loading && !apiError && (
          <div className='pagination-controls'>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className='pagination-button'
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(books.length / booksPerPage)}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === Math.ceil(books.length / booksPerPage)}
              className='pagination-button'
            >
              Next
            </button>
          </div>
        )}

        {/* Selector para cambiar libros por página */}
        {!loading && !apiError && (
          <div className='books-per-page-selector'>
            <label htmlFor='booksPerPage'>Books per page:</label>
            <select
              id='booksPerPage'
              value={booksPerPage}
              onChange={(e) => setBooksPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
