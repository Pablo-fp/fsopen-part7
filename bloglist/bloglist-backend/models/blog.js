const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Remove the debugging log to avoid side-effects
    // console.log('Transforming document:', returnedObject);
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
    }
    delete returnedObject.__v;

    // Prevent circular reference in the user field
    if (returnedObject.user) {
      returnedObject.user = {
        id: returnedObject.user.id,
        username: returnedObject.user.username,
        name: returnedObject.user.name
      };
    }
    return returnedObject;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
