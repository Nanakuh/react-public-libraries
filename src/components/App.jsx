import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BookCard from "./BookCard";

const API_URL = "https://openlibrary.org/search.json?q=book";

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(20);
  const [inputPage, setInputPage] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setApiError(null);

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.docs || data.docs.length === 0) {
          throw new Error("No books found.");
        }

        const booksReadyForUI = data.docs.map((book) => ({
          key: book.key || `book-${book.cover_i || Math.random().toString(36)}`,
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
        console.error(e);
        setApiError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const filteredBooks = currentBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTitle.toLowerCase())
  );
  

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleGoToPage = () => {
    const pageNumber = Number(inputPage);

    if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
      alert("Please enter a valid page number.");
      return;
    }

    setCurrentPage(pageNumber);
    setInputPage("");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [booksPerPage]);

  return (
    <div>
      <Header />
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search by title...'
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      <main className='book-list'>
        {loading && <p className='loading-message'>Loading books...</p>}
        {apiError && <p className='error-message'>{apiError}</p>}
        {!loading &&
          !apiError &&
          filteredBooks.map((book) => (
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
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className='pagination-button'
            >
              Next
            </button>
          </div>
        )}

        {!loading && !apiError && (
          <div className='go-to-page'>
            <label htmlFor='pageInput'>Go to page:</label>
            <input
              id='pageInput'
              type='number'
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              min='1'
              max={totalPages}
              placeholder='Enter page...'
            />
            <button onClick={handleGoToPage}>Go</button>
          </div>
        )}

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
