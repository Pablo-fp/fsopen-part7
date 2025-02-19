import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const BlogForm = ({ onCreateBlogFormSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlogFormSubmit = (event) => {
    event.preventDefault();
    onCreateBlogFormSubmit({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={handleCreateBlogFormSubmit}>
      <h2>Create New</h2>
      <div>
        <TextField
          label="Title"
          name="title"
          id="blog-title-input"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          margin="dense"
          size="small"
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Author"
          name="author"
          id="blog-author-input"
          onChange={(event) => setAuthor(event.target.value)}
          value={author}
          margin="dense"
          size="small"
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Url"
          name="url"
          id="blog-url-input"
          onChange={(event) => setUrl(event.target.value)}
          value={url}
          margin="dense"
          size="small"
          fullWidth
        />
      </div>
      <div>
        <Button
          id="blog-submit-button"
          type="submit"
          variant="contained"
          size="small"
        >
          create
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
