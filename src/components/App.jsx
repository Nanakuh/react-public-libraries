import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BookCard from "./BookCard";

const App = () => {
  const [books, setBooks] = useState([]);

  // Obtener datos de la API al cargar la aplicación
  useEffect(() => {
    fetch("https://openlibrary.org/subjects/science_fiction.json?limit=10")
      .then((response) => response.json())
      .then((data) => setBooks(data.works))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <Header />
      <main className='book-list'>
        {books.map((book) => (
          <BookCard
            key={book.key}
            title={book.title}
            author={book.authors[0]?.name || "Unknown"}
            cover={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default App;
