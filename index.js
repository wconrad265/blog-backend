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
      - will have the app that we import
      - we will just listen for requests 
    -controller/blogs.js
      - this will be oure controller
*/

const app = require("./app");
const { PORT } = require("./utils/config");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
