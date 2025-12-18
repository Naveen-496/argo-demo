const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store for books
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, isbn: '978-0743273565' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, isbn: '978-0061120084' },
  { id: 3, title: '1984', author: 'George Orwell', year: 1949, isbn: '978-0451524935' }
];

let nextId = 4;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// ============== CRUD ENDPOINTS ==============

// GET all books
app.get('/api/books', (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
    count: books.length
  });
});

// GET a single book by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  
  res.status(200).json({
    success: true,
    data: book
  });
});

// CREATE a new book
app.post('/api/books', (req, res) => {
  const { title, author, year, isbn } = req.body;
  
  // Validation
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: 'Title and author are required'
    });
  }
  
  const newBook = {
    id: nextId++,
    title,
    author,
    year: year || new Date().getFullYear(),
    isbn: isbn || 'N/A'
  };
  
  books.push(newBook);
  
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});

// UPDATE a book by ID
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  const { title, author, year, isbn } = req.body;
  
  // Update only provided fields
  if (title) book.title = title;
  if (author) book.author = author;
  if (year) book.year = year;
  if (isbn) book.isbn = isbn;
  
  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: book
  });
});

// DELETE a book by ID
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  const deletedBook = books.splice(index, 1);
  
  res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook[0]
  });
});

// DELETE all books
app.delete('/api/books', (req, res) => {
  const count = books.length;
  books = [];
  nextId = 4;
  
  res.status(200).json({
    success: true,
    message: `All ${count} books deleted successfully`
  });
});

// ============== ERROR HANDLING ==============

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`📚 Book API Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API docs: http://localhost:${PORT}/api/books`);
});
