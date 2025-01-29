<<<<<<< HEAD
const http = require('http');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
=======
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's assigned port

app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
>>>>>>> 54b69bc017fed75d829997dafca55f00872c1fdf
});
