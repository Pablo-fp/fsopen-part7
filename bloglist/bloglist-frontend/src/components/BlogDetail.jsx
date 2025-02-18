import React from 'react';

const BlogDetail = ({ blog, onBlogLike }) => {
  if (!blog) return null;

  const handleLikeClick = () => {
    const updatedBlog = {
      ...blog,
      // matching the update semantics from Blog.jsx:
      user: blog.user.id,
      likes: blog.likes + 1
    };
    onBlogLike(updatedBlog);
  };

  return (
    <div>
      <h1>{blog.title}</h1>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes <button onClick={handleLikeClick}>like</button>
      </div>
      <div>Added by {blog.user.username}</div>
    </div>
  );
};

export default BlogDetail;
