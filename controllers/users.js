const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error:
        "Invalid Password. Password must be given and more than 3 characters",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username: username,
    passwordHash: passwordHash,
  });

  await newUser.save();

  response.status(201).json(newUser);
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({});

  response.json(users);
});
module.exports = userRouter;
/*
  -Implement a way to create new users by doing an HTTP POST request to address api/users. 
   Users have a username, password and name.

  Steps
    - install bcrypt
    - create user schema
    - create router with express controller for users
      - create route to adding a new user
    - add userRouter to app.js
    - update middleware to handle errors for duplicates
  
*/
