import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [copies, setCopies] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    axios.post('http://localhost:7777/books', {
      title: title,
      author: author,
      isbn: isbn,
      category: category,
      copies: Number(copies)
    })
      .then((res) => {
        setLoading(false);
        navigate('/');
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to add book. Please try again.');
        }
      });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
        <h2>Add New Book</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Title:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Operating System Concepts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Author:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Abraham Silberschatz"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN Number:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 978-1118063330"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category / Genre:</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Computer Science, Mathematics"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Available Copies:</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Book'}
            </button>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
