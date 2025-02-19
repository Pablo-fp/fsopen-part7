const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1, _id: 1 });
  response.status(200).json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('comments', {
    content: 1,
    _id: 1
  });
  if (blog) {
    response.status(200).json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,

    likes: body.likes || 0,
    user: user
  });

  const savedBlog = await blog.save();
  user.blogs = [...user.blogs, savedBlog];
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id);

  if (!blog) {
    return response
      .status(400)
      .json({ error: 'there is no blog with this id' });
  }
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  if (!author || !url || !title || !likes || !user) {
    return response.status(400).json({
      error:
        'make sure all required fields are sent (title, author, url, likes, user)'
    });
  }

  const blog = { title, author, url, likes, user };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query'
  }).populate('user', {
    username: 1,
    name: 1,
    id: 1
  });

  if (updatedBlog) {
    response.status(201).json(updatedBlog);
  } else {
    response.status(400).json({
      error: `No person with this id: '${request.params.id}'`
    });
  }
});

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const { content } = request.body;
    if (!content) {
      return response.status(400).json({ error: 'missing content' });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    const comment = new Comment({
      content,
      blog: blog._id
    });

    const savedComment = await comment.save();

    // Add the comment's id to the blog's comments array.
    blog.comments = blog.comments.concat(savedComment._id);
    await blog.save();

    response.status(201).json(savedComment.toJSON());
  } catch (error) {
    next(error);
  }
});

// Add route to handle posting comments
blogsRouter.delete(
  '/:id/comments/:commentId',
  async (request, response, next) => {
    try {
      const { id, commentId } = request.params;
      console.log('DELETE comment route hit:', request.params);

      // Find the blog.
      const blog = await Blog.findById(id);
      if (!blog) {
        return response.status(404).json({ error: 'blog not found' });
      }

      // Ensure the comment exists.
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return response.status(404).json({ error: 'comment not found' });
      }

      // Remove the comment from the blog's comments array manually.
      blog.comments = blog.comments.filter((c) => c.toString() !== commentId);
      await blog.save();

      // Remove the comment from the Comment collection.
      await Comment.findByIdAndDelete(commentId);

      response.status(204).end();
    } catch (error) {
      console.error('Error in DELETE comment route:', error);
      next(error);
    }
  }
);

module.exports = blogsRouter;
