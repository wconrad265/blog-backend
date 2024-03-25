const { test, beforeEach, after, describe, before } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const supertest = require("supertest");
const { request } = require("node:http");

const api = supertest(app);

describe("When there are some blog posts saved", () => {
  let authorization;
  let userId;

  //create initial user in database
  before(async () => {
    await User.deleteMany({});

    const response = await api
      .post("/api/users")
      .send(helper.rootUser)
      .expect(201);

    userId = response.body.id;
  });

  //get token for initial user in database
  before(async () => {
    const response = await api
      .post("/api/login")
      .send(helper.rootUser)
      .expect(200);

    authorization = { authorization: `Bearer ${response.body.token}` };
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    const user = await User.findById(userId);

    const blogObject = helper.blogs.map(
      (blog) => new Blog({ ...blog, user: user._id })
    );

    const promiseArray = blogObject.map((blog) => blog.save());

    await Promise.all(promiseArray);
  });

  test("blogs returned from api are in application json format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.blogs.length);
  });

  test("unique identifier of blog posts is id", async () => {
    const response = await helper.blogsInDB();

    const hasIdProperty = response.every(
      (blog) => blog.hasOwnProperty("id") && !blog.hasOwnProperty("_id")
    );

    assert.ok(hasIdProperty);
  });

  describe("adding a blog post", () => {
    test("a valid blog can be added", async () => {
      const blog = {
        title: "This is a test",
        author: "will",
        url: "http://www.test.com",
        likes: 30,
      };

      await api
        .post("/api/blogs")
        .send(blog)
        .set(authorization)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDB();

      assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes("This is a test"));
    });

    test("if likes is missing, default value should be 0", async () => {
      const blog = {
        title: "This is a test",
        author: "will",
        url: "http://www.test.com",
      };

      await api
        .post("/api/blogs")
        .send(blog)
        .set(authorization)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDB();

      assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1);

      const addedBlog = blogsAtEnd.find((b) => b.title === "This is a test");

      assert.strictEqual(addedBlog.likes, 0);
    });

    test("if title/url is missing, 400 status code is received", async () => {
      const noTitleBlog = {
        author: "will",
        url: "http://www.test.com",
        likes: 30,
      };

      const noUrlBlog = {
        title: "This is a test",
        author: "will",
        likes: 30,
      };

      const noTitleAndUrlBlog = {
        author: "will",
        likes: 30,
      };

      await api
        .post("/api/blogs")
        .send(noTitleBlog)
        .set(authorization)
        .expect(400);
      await api
        .post("/api/blogs")
        .send(noUrlBlog)
        .set(authorization)
        .expect(400);
      await api
        .post("/api/blogs")
        .send(noTitleAndUrlBlog)
        .set(authorization)
        .expect(400);
    });

    test("If token is not provided, creation fails with 401 status code", async () => {
      const blog = {
        title: "This is a test",
        author: "will",
        url: "http://www.test.com",
        likes: 30,
      };

      await api
        .post("/api/blogs")
        .send(blog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDB();

      assert.strictEqual(blogsAtEnd.length, helper.blogs.length);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes("This is a test"));
    });
  });

  describe("deleting a blog post", () => {
    test("succeeds with valid 204 status code", async () => {
      const blogsAtStart = await helper.blogsInDB();

      const blogToDelete = blogsAtStart[0];
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set(authorization)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDB();

      assert.deepEqual(blogsAtEnd.length, helper.blogs.length - 1);

      const titles = blogsAtEnd.map((b) => b.title);

      assert(!titles.includes(blogToDelete.title));
    });

    test("fails with 401 status code if token is not provided", async () => {
      const blogsAtStart = await helper.blogsInDB();

      const blogToDelete = blogsAtStart[0];
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await helper.blogsInDB();

      assert.deepEqual(blogsAtEnd.length, helper.blogs.length);

      const titles = blogsAtEnd.map((b) => b.title);

      assert(titles.includes(blogToDelete.title));
    });
  });

  describe("updating a blog", () => {
    test("updating a blog responds with a 200 status code", async () => {
      const updatedBlog = {
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 30,
      };

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("validating that likes updated", async () => {
      const updatedBlog = {
        id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 50,
      };

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDB();

      const blogWithChanges = blogsAtEnd.find((b) => b.id === updatedBlog.id);

      assert.deepEqual(blogWithChanges.likes, updatedBlog.likes);
    });

    test("responds with 400 status code with invalid id", async () => {
      const nonExistingId = await helper.nonExistingId();

      await api.put(`/api/blogs/${nonExistingId}`).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
