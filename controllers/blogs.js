const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  if (!request.token || !request.user) {
    return response.status(401).send({ message: "Unauthorized" });
  }

  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: request.user._id,
  });

  const newBlog = await blog.save();
  
  await newBlog.populate("user", {
    username: 1,
    name: 1,
  });

  response.status(201).json(newBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { token, user } = request;
  if (!token || !user) {
    return response.status(401).send({ message: "Unauthorized" });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).send({ message: "Unauthorized" });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.send(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  if (!updatedBlog) response.send(400).end();

  response.json(updatedBlog);
});

module.exports = blogsRouter;
