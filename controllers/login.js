const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const pgService = require("../utils/pgService");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const passwordCorrect = await pgService.authenticate(username, password);

  if (!passwordCorrect) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userInfo = await pgService.getUserInfoFromUsername(username);

  const userForToken = {
    username: userInfo.username,
    id: userInfo.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, name: userInfo.name, username: userInfo.username });
});

module.exports = loginRouter;
