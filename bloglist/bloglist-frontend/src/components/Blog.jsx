import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog, refreshBlogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      // Let the parent handler take care of the deletion API call and Redux update.
      refreshBlogs(blog.id);
    }
  };

  return (
    <div style={blogStyle} className="blog-container">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
      <button onClick={handleDelete} style={{ marginLeft: '1rem' }}>
        delete
      </button>
    </div>
  );
};

export default Blog;
