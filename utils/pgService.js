const { dbQuery } = require("./dbquery");
const bcrypt = require("bcrypt");

authenticate = async (username, password) => {
  const SELECT_HASHED_PASSWORD =
    "SELECT password FROM users WHERE username = $1";

  const result = await dbQuery(SELECT_HASHED_PASSWORD, username);
  if (result.rowCount === 0) return false;

  return bcrypt.compare(password, result.rows[0].password);
};

getUserId = async (username) => {
  const SELECT_USER_ID = "SELECT id FROM users WHERE username = $1";

  const result = await dbQuery(SELECT_USER_ID, username);

  return result.rows[0].id;
};

const createUser = async (username, name, password) => {
  const INSERT_USER =
    "INSERT INTO users (username, name, password) VALUES ($1, $2, $3) RETURNING id";

  try {
    const result = await dbQuery(INSERT_USER, username, name, password);
    return result.rows[0].id;
  } catch (error) {
    if (isUniqueConstraintViolation(error)) return false;
    throw error;
  }
};

const getUserInfoFromId = async (id) => {
  const SELECT_USER_INFO = "SELECT id, username, name FROM users WHERE id = $1";
  const result = await dbQuery(SELECT_USER_INFO, id);
  return result.rows[0];
};

const getUserInfoFromUsername = async (username) => {
  const SELECT_USER_INFO =
    "SELECT id, username, name FROM users WHERE username = $1";
  const result = await dbQuery(SELECT_USER_INFO, username);
  return result.rows[0];
};

const getAllUsers = async () => {
  const SELECT_USERS = "SELECT id, name, username FROM users;";

  const result = await dbQuery(SELECT_USERS);
  return result.rows;
};

const isUniqueConstraintViolation = (error) => {
  return /duplicate key value violates unique constraint/.test(String(error));
};

module.exports = {
  authenticate,
  getUserId,
  createUser,
  getAllUsers,
  getUserInfoFromId,
  getUserInfoFromUsername,
};
