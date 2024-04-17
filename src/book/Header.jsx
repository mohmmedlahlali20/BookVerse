import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Header() {
    const URL = "http://openlibrary.org/people/george08/lists.json";
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
    useEffect(() => {
        // Fetch all books when component mounts
        fetchAllBooks();
    }, []);

    const fetchAllBooks = () => {
        setLoading(true);
        setError(null);
        setSearchResult(null);

        axios.get(URL)
            .then(response => {
                setSearchResult(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const handleSearch = () => {
        // Don't search if the search term is empty
        if (!searchTerm.trim()) {
            return;
        }
    
        setLoading(true);
        setError(null);
        setSearchResult(null);
    
        // Encode the search term before appending it to the URL
        const encodedSearchTerm = encodeURIComponent(searchTerm.trim());

        axios.get(`${URL}?title=${encodedSearchTerm}`)
            .then(response => {
                setSearchResult(response.data.docs || []);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    return (
        <div className="container">
            <div className="alert alert-info m-5" role="alert">
                Welcome to our book search platform! Use the search bar below to find your favorite books.
            </div>
            <h1 className="text-center m-5 text-primary">Book Search</h1>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for books..."
                    aria-label="Search for books"
                    aria-describedby="basic-addon2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error.message}</div>}
            {searchTerm === '' && searchResult && (
                <div>
                    <h3>All Books</h3>
                    <ul className="list-group">
                        {Array.isArray(searchResult) ? (
                            searchResult.map((list, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>List Name: </strong>{list.name}<br />
                                    <strong>Number of Books: </strong>{list.entry_count}<br />
                                    {/* You can add more details about the list if needed */}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">No books found</li>
                        )}
                    </ul>

                    {(searchTerm !== '' || Array.isArray(searchResult)) && (
                        <div>
                            <h3>Search Results</h3>
                            <ul className="list-group">
                                {Array.isArray(searchResult) && searchResult.length > 0 ? (
                                    searchResult.map((book, index) => (
                                        <li key={index} className="list-group-item">
                                            <strong>Title: </strong>{book.title}<br />
                                            <strong>Author(s): </strong>{book.author_name ? book.author_name.join(', ') : 'N/A'}<br />
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">No results found</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
