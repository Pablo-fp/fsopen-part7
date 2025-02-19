import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const LoginForm = ({ onLoginFormSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLoginFormSubmit({ username, password });
    setUsername('');
    setPassword('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField
          label="Username"
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          margin="dense"
          fullWidth
          size="small"
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          name="password"
          id="password"
          margin="dense"
          fullWidth
          size="small"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <Button variant="contained" id="login-submit-button" type="submit">
        login
      </Button>
    </form>
  );
};

export default LoginForm;
