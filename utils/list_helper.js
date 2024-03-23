const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => acc + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return blogs;

  const result = blogs.reduce(
    (max, curr) => (curr.likes > max.likes ? curr : max),
    blogs[0]
  );

  return {
    title: result.title,
    author: result.author,
    likes: result.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return [];

  const obj = {};

  for (const blog of blogs) {
    const { author } = blog;
    obj[author] ? (obj[author] += 1) : (obj[author] = 1);
  }

  const result = Object.keys(obj).reduce((max, curr) =>
    obj[curr] > obj[max] ? curr : max
  );

  return {
    author: result,
    blogs: obj[result],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return [];

  const obj = {};

  for (const blog of blogs) {
    const { author, likes } = blog;
    obj[author] ? (obj[author] += likes) : (obj[author] = likes);
  }

  const result = Object.keys(obj).reduce((max, curr) =>
    obj[curr] > obj[max] ? curr : max
  );

  return {
    author: result,
    likes: obj[result],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
