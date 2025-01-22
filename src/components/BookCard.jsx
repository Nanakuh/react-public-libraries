import React from "react";

const BookCard = ({ title, author, cover }) => {
  return (
    <div className="book-card">
      <img src={cover} alt={`${title} cover`} className="book-cover" />
      <h3 className="book-title">{title}</h3>
      <p className="book-author">By {author}</p>
    </div>
  );
};

export default BookCard;
