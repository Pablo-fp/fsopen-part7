import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell } from '@mui/material';

const Blog = ({ blog, refreshBlogs }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      // Let the parent handler take care of the deletion API call and Redux update.
      refreshBlogs(blog.id);
    }
  };

  return (
    <>
      <TableCell>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </TableCell>
      <TableCell>{blog.author}</TableCell>
      <TableCell>
        <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>
          delete
        </button>
      </TableCell>
    </>
  );
};

export default Blog;
