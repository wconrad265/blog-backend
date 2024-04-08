const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.post("/", async (request, response) => {
  const { username, password, name } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error:
        "Invalid Password. Password must be given and more than 3 characters",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  await newUser.save();

  response.status(201).json(newUser);
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({});

  response.json(users);
});
module.exports = userRouter;
