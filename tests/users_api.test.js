const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const supertest = require("supertest");

const api = supertest(app);

describe("When there is initially one user in the database", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("1234", 10);
    const user = new User({
      username: "root",
      name: 'Root Btw',
      passwordHash,
    });

    await user.save();
  });

  test("creation succeeds when adding one valid user to the database", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "will",
      name: 'Will Btw',
      password: "12345",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    const usernames = usersAtEnd.map((u) => u.username);

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    assert(usernames.includes(newUser.username));
  });

  describe("creation fails when user information is invalid", () => {
    test("when username is not given", async () => {
      const usersAtStart = await helper.usersInDB();

      const noUsername = {
        password: "12345",
      };

      await api
        .post("/api/users")
        .send(noUsername)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDB();
      const usernames = usersAtEnd.map((u) => u.username);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert(!usernames.includes(noUsername.username));
    });

    test("when password is not given", async () => {
      const usersAtStart = await helper.usersInDB();

      const noPassword = {
        username: "12345",
      };

      await api
        .post("/api/users")
        .send(noPassword)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDB();
      const usernames = usersAtEnd.map((u) => u.username);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert(!usernames.includes(noPassword.username));
    });

    test("when name is not given", async () => {
      const usersAtStart = await helper.usersInDB();

      const noPassword = {
        username: "12345",
        password: '12345'
      };

      await api
        .post("/api/users")
        .send(noPassword)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDB();
      const usernames = usersAtEnd.map((u) => u.username);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert(!usernames.includes(noPassword.username));
    });

    test("when username is not unique", async () => {
      const usersAtStart = await helper.usersInDB();

      const newUser = {
        username: "root",
        password: "1234",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDB();

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("when username is less then 3 characters", async () => {
      const usersAtStart = await helper.usersInDB();

      const newUser = {
        username: "ro",
        password: "1234",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDB();
      const usernames = usersAtEnd.map((u) => u.username);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert(!usernames.includes(newUser.username));
    });

    test("when password is less then 3 characters", async () => {
      const usersAtStart = await helper.usersInDB();

      const newUser = {
        username: "will",
        password: "12",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDB();
      const usernames = usersAtEnd.map((u) => u.username);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert(!usernames.includes(newUser.username));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
