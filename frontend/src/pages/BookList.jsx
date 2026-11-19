import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BookList() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:7777/books?search=${search}`)
      .then((res) => {
        if (res.data && res.data.data) {
          setBooks(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch books from server');
        setLoading(false);
      });
  }, [search]);


  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book record?');
    if (!confirmDelete) return;

    axios.delete(`http://localhost:7777/books/${id}`)
      .then((res) => {
        setMessage('Book deleted successfully');
        setBooks(books.filter((b) => b._id !== id));
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        setError('Failed to delete book');
      });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="top-bar">
          <h2>Library Book Records</h2>
          <Link to="/add" className="btn btn-success">
            + Add New Book
          </Link>
        </div>

        <div className="top-bar">
          <input
            type="text"
            className="form-control search-box"
            placeholder="Search books by title, author, category, ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No book records found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Copies</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>{book.category}</td>
                    <td>{book.copies}</td>
                    <td>
                      <Link to={`/edit/${book._id}`} className="btn btn-primary btn-sm">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;
