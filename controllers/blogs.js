const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const pgService = require("../utils/pgService");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await pgService.getUserInfoFromId(request.userId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user,
  });

  const newBlog = await blog.save();

  response.status(201).json(newBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const { userId } = request;

  const blog = await Blog.findById(request.params.id);

  if (blog.user.id.toString() !== userId.toString()) {
    return response.status(401).send({ message: "Unauthorized" });
  }

  await Blog.findByIdAndDelete(request.params.id);

  response.sendStatus(204).end();
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
  });

  if (!updatedBlog) response.send(400).end();

  response.json(updatedBlog);
});

module.exports = blogsRouter;
