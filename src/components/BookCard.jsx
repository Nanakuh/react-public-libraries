import PropTypes from "prop-types";

const BookCard = ({ title, author, cover }) => {
  return (
    <div className='book-card'>
      <img src={cover} alt={`${title} cover`} className='book-cover' />
      <h3 className='book-title'>{title}</h3>
      <p className='book-author'>By {author}</p>
    </div>
  );
};

// Validación de las props
BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
};

export default BookCard;
