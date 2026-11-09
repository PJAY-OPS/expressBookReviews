const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }else{
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = {};
  for(let key in books){
    if(books[key].author === author){
      filtered_books[key] = books[key];
    }
  }
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = {};
  for(let key in books){
    if(books[key].title === title){
      filtered_books[key] = books[key];
    }
  }
  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10-13 - Using Axios with Promises and Async/Await (Client side simulation)
// These functions demonstrate Tasks 10-13
const axios = require('axios');

// Task 10: Get all books - Async/Await
async function getAllBooks(){
  try{
    let response = await axios.get('http://localhost:5000/');
    return response.data;
  }catch(e){console.log(e)}
}

// Task 11: Get by ISBN - Promise
function getBookByISBN(isbn){
  return new Promise((resolve,reject)=>{
    axios.get(`http://localhost:5000/isbn/${isbn}`).then(res=>resolve(res.data)).catch(err=>reject(err));
  });
}

// Task 12: Get by Author - Async/Await
async function getBooksByAuthor(author){
  try{
    let response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  }catch(e){console.log(e)}
}

// Task 13: Get by Title - Promise
function getBooksByTitle(title){
  return new Promise((resolve,reject)=>{
    axios.get(`http://localhost:5000/title/${title}`).then(res=>resolve(res.data)).catch(err=>reject(err));
  });
}

module.exports.general = public_users;
