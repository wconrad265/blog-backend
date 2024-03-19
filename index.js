/*
  Steps
    - establish a database
      - establish a connection
      - create ENV file to store PORT and url
      -create blog.js to handle mongoose schema
    - app.js
      - will have connection information
    - models/blog.js (done)
      - will contain schema definition for the mongoose database
    - utils/config (done)
      - import dotenv
      - will contain mongoURL
      - export it
    - utils/logger (done)
      - info/error console.logs
    - .env (done)
      - this contains the env information
    - index.js
      - will have 
    -router
*/

const express = require("express");
const app = express();
const cors = require("cors");



app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
