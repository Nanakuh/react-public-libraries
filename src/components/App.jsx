import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BookCard from "./BookCard";

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Para saber si los datos están cargándose
  const [apiError, setApiError] = useState(null); // Para guardar el mensaje de error

  // Obtener datos de la API al cargar la aplicación
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // Comenzamos en estado de carga
      setApiError(null); // Reiniciamos cualquier error previo

      try {
        const response = await fetch(
          "https://openlibrary.org/search.json?q=book&limit=40"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`); // Lanzar error si la respuesta no es 200 OK
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

        setBooks(booksReadyForUI); // Actualizamos los libros en el estado
      } catch (e) {
        setApiError(e.message); // Guardamos el mensaje del error
      } finally {
        setLoading(false); // Dejamos de estar en estado de carga
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <Header />
      <main className="book-list">
        {loading && <p className="loading-message">Loading books...</p>} {/* Mostrar mientras cargamos */}
        {apiError && <p className="error-message">{apiError}</p>} {/* Mostrar si hay un error */}
        {!loading && !apiError && books.map((book) => (
          <BookCard
            key={book.key}
            title={book.title}
            author={book.author}
            cover={book.cover}
          />
        ))} {/* Mostrar los libros si no hay errores y no estamos cargando */}
      </main>
      <Footer />
    </div>
  );
  
};

export default App;
