const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Unable to register user. Username and password are required." });
    }
    if (!isValid(username)) {
        return res.status(404).json({ message: "User already exists!" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let result = {};
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    });
    if (Object.keys(result).length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }
    return res.status(404).json({ message: "No books found for this author" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let result = {};
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    });
    if (Object.keys(result).length > 0) {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }
    return res.status(404).json({ message: "No books found with this title" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});


// ---------------------------------------------------------------
// Tasks 10-13: the same lookups using async/await with Axios
// ---------------------------------------------------------------
const BASE_URL = "http://localhost:5000";

// Task 10: get all books
const getAllBooks = async () => {
    try {
        const response = await axios.get(BASE_URL + "/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
};

// Task 11: get book details by ISBN
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(BASE_URL + "/isbn/" + isbn);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching book by ISBN:", error.message);
    }
};

// Task 12: get book details by author
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(BASE_URL + "/author/" + encodeURIComponent(author));
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
    }
};

// Task 13: get book details by title
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(BASE_URL + "/title/" + encodeURIComponent(title));
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by title:", error.message);
    }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
