const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Mock data for books and reviews
const books = [
    { isbn: '978-3-16-148410-0', title: 'Book One', author: 'Author One', reviews: [] },
    { isbn: '978-1-23-456789-7', title: 'Book Two', author: 'Author Two', reviews: [] },
    { isbn: '978-0-12-345678-9', title: 'Book Three', author: 'Author One', reviews: [] }
];

const users = [];

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(books);
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = books.filter(b => b.author === author);
    res.json(booksByAuthor);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = books.filter(b => b.title === title);
    res.json(booksByTitle);
});

// Task 5: Get book Review
app.get('/books/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).send('Book not found');
    }
});

// Task 6: Register New user
app.post('/users/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        res.status(400).send('User already exists');
    } else {
        users.push({ username, password });
        res.status(201).send('User registered successfully');
    }
});

// Task 7: Login as a Registered user
app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Task 8: Add/Modify a book review (for registered users)
app.post('/books/:isbn/reviews', (req, res) => {
    const { isbn } = req.params;
    const { username, review, rating } = req.body;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        const existingReview = book.reviews.find(r => r.username === username);
        if (existingReview) {
            existingReview.review = review;
            existingReview.rating = rating;
        } else {
            book.reviews.push({ username, review, rating });
        }
        res.send('Review added/updated successfully');
    } else {
        res.status(404).send('Book not found');
    }
});

// Task 9: Delete book review added by that particular user (for registered users)
app.delete('/books/:isbn/reviews', (req, res) => {
    const { isbn } = req.params;
    const { username } = req.body;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        const reviewIndex = book.reviews.findIndex(r => r.username === username);
        if (reviewIndex !== -1) {
            book.reviews.splice(reviewIndex, 1);
            res.send('Review deleted successfully');
        } else {
            res.status(404).send('Review not found');
        }
    } else {
        res.status(404).send('Book not found');
    }
});

// Task 10: Get all books – Using async callback function
app.get('/async/books', (req, res) => {
    res.json(books);
});

// Task 11: Search by ISBN – Using Promises
app.get('/promise/books/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books.find(b => b.isbn === isbn);
    return new Promise((resolve, reject) => {
        if (book) {
            resolve(res.json(book));
        } else {
            reject(res.status(404).send('Book not found'));
        }
    });
});

// Task 12: Search by Author
app.get('/promise/books/author/:author', (req, res) => {
    const { author } = req.params;
    const booksByAuthor = books.filter(b => b.author === author);
    return new Promise((resolve, reject) => {
        resolve(res.json(booksByAuthor));
    });
});

// Task 13: Search by Title
app.get('/promise/books/title/:title', (req, res) => {
    const { title } = req.params;
    const booksByTitle = books.filter(b => b.title === title);
    return new Promise((resolve, reject) => {
        resolve(res.json(booksByTitle));
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
