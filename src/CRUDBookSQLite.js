const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

require("dotenv").config();

// connect to database
const db = new sqlite3.Database('./Database/Book.sqlite');

// parse incoming requests
app.use(express.json());

// create books table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    created_at TEXT,
    updated_at TEXT
)`);

// route to get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});

// route to get a book by id
app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send('Book not found');
            } else {
                res.json(row);
            }
        }
    });
});

// route to create a new book
app.post('/books', (req, res) => {
    const book = req.body;
    const createdAt = new Date().toISOString(); // Get the current timestamp in ISO format
    db.run('INSERT INTO books (title, author, created_at) VALUES (?, ?, ?)', 
           book.title, book.author, createdAt, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            book.created_at = createdAt; // Add created_at to the response
            res.send(book);
        }
    });
});

// route to update a book
app.put('/books/:id', (req, res) => {
    const book = req.body;
    const updatedAt = new Date().toISOString(); // Current time in ISO format

    // First check if the book exists in the database
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        if (!row) {
            return res.status(404).send('Book not found');
        }

        // If the book exists, proceed with the update
        db.run('UPDATE books SET title = ?, author = ?, updated_at = ? WHERE id = ?', 
               book.title, book.author, updatedAt, req.params.id, function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            // Send the updated book info as response
            book.id = req.params.id;
            book.updated_at = updatedAt;
            res.send(book);
        });
    });
});

// route to delete a book
app.delete('/books/:id', (req, res) => {
    db.run('DELETE FROM books WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});

const port = process.env.PORT || 4091;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
