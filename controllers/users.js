const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const pgService = require("../utils/pgService");

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

  const id = await pgService.createUser(username, name, passwordHash);

  const newUser = {
    id,
    username,
    name,
    passwordHash,
  };

  response.status(201).json(newUser);
});

userRouter.get("/", async (request, response) => {
  const users = await pgService.getAllUsers();

  response.json(users);
});
module.exports = userRouter;
