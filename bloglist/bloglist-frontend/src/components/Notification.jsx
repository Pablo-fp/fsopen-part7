import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';

const Notification = ({ message }) => {
  if (!message || !message.type || !message.content) {
    return null; // Return null if there's no valid message
  }

  return <Alert severity={message.type}>{message.content}</Alert>;
};

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error']), // Restrict to 'success' or 'error'
    content: PropTypes.string // Ensure content is a string
  })
};

Notification.defaultProps = {
  message: null // Default to null if no message is provided
};

export default Notification;
