import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, FormControl, Button } from 'react-bootstrap';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let response;
        if (query.trim() === '') {
          // Fetch all books
          response = await axios.get('https://openlibrary.org/works/OL45804W/editions.json');
        } else {
          // Fetch books based on search query
          response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        }
        if (response.data.entries) {
          setBooks(response.data.entries);
        } else if (response.data.docs) {
          setBooks(response.data.docs);
        } else {
          setBooks([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const toggleFavorite = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index].isFavorite = !updatedBooks[index].isFavorite;
    setBooks(updatedBooks);
  };

  // Sort books array to display favorite books first
  const sortedBooks = [...books].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  return (
    <Container>
      <h1 className="mt-4 mb-3">Books</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <FormControl type="text" value={query} onChange={handleInputChange} placeholder="Search for books..." />
      </Form>
      {loading ? (
        <p>Loading...</p>
      ) : sortedBooks.length > 0 ? (
        <Row>
          {sortedBooks.map((book, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                {book.cover && book.cover.medium && (
                  <Card.Img variant="top" src={`https://covers.openlibrary.org/b/id/${book.cover.medium}-M.jpg`} />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>{book.author_name ? `Author(s): ${book.author_name.join(', ')}` : 'Unknown Author'}</Card.Text>
                  <Button variant={book.isFavorite ? "success" : "outline-secondary"} onClick={() => toggleFavorite(index)}>
                    {book.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No books found.</p>
      )}
    </Container>
  );
};

export default BooksPage;
