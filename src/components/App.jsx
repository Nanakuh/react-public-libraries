import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BookCard from "./BookCard";

const App = () => {
  const [books, setBooks] = useState([]);

  // Obtener datos de la API al cargar la aplicación
  useEffect(() => {
    fetch("https://openlibrary.org/search.json?q=book&limit=40")
      .then((response) => response.json())
      .then((data) => {
        const formattedBooks = data.docs.map((book) => ({
          key: book.key || Math.random().toString(),
          title: book.title || "Unknown Title",
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "https://via.placeholder.com/150",
          author:
            Array.isArray(book.author_name) && book.author_name.length > 0
              ? book.author_name[0]
              : "Unknown", // Procesamos el autor aquí
        }));

        setBooks(formattedBooks);
      })
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
            author={book.author}
            cover={book.cover}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default App;
