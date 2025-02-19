import React, { useState, useEffect } from 'react';
import blogService from '../services/blogs';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';

const BlogDetail = ({ blog, onBlogLike }) => {
  if (!blog) return null;

  // Local state for handling comment addition
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Update comments state when blog prop updates
  useEffect(() => {
    setComments(blog.comments || []);
  }, [blog]);

  const handleLikeClick = () => {
    const updatedBlog = {
      ...blog,
      // matching the update semantics from Blog.jsx:
      user: blog.user.id,
      likes: blog.likes + 1
    };
    onBlogLike(updatedBlog);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await blogService.addComment(blog.id, {
        content: commentText
      });
      setComments([...comments, response]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await blogService.deleteComment(blog.id, commentId);
      // Update state using a function to ensure the latest value is used.
      const updatedBlog = await blogService.getOne(blog.id);
      setComments(updatedBlog.comments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <h1>{blog.title}</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow key={blog.id}>{blog.url}</TableRow>
            <TableRow key={blog.id}>
              {blog.likes} likes{' '}
              <Button
                variant="contained"
                size="small"
                color="white"
                onClick={handleLikeClick}
              >
                like
              </Button>
            </TableRow>
            <TableRow key={blog.id}>Added by {blog.user.username}</TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentText}
          onChange={({ target }) => setCommentText(target.value)}
          placeholder="Write a comment..."
        />
        <Button variant="contained" size="small" color="white" type="submit">
          Add Comment
        </Button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content}{' '}
            <button onClick={() => handleDeleteComment(comment.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetail;
