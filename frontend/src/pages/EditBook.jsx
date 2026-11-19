import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [copies, setCopies] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    axios.get(`http://localhost:7777/books/${id}`)
      .then((res) => {
        if (res.data && res.data.data) {
          const book = res.data.data;
          setTitle(book.title);
          setAuthor(book.author);
          setIsbn(book.isbn);
          setCategory(book.category);
          setCopies(book.copies);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load book details');
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    axios.put(`http://localhost:7777/books/${id}`, {
      title: title,
      author: author,
      isbn: isbn,
      category: category,
      copies: Number(copies)
    })
      .then((res) => {
        setSaving(false);
        navigate('/');
      })
      .catch((err) => {
        setSaving(false);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Failed to update book. Please try again.');
        }
      });
  };

  if (loading) {
    return <div className="container"><p>Loading book details...</p></div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
        <h2>Update Book Details</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Book Title:</label>
            <input
              type="text"
              className="form-control"
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Update Book'}
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

export default EditBook;
