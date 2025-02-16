import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import { setNotificationWithTimeout } from './reducers/notificationReducer';

const App = () => {
  /* States */
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  /* Redux */
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  /* Refs */
  const createFormRef = useRef();

  /* Effects */
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  /* Handle */
  const handleLoginSubmit = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
    } catch (exception) {
      console.log(exception);
      dispatch(
        setNotificationWithTimeout(
          {
            type: 'error',
            content: exception.response.data.error
          },
          5000
        )
      );
    }
  };

  const handleCreateFormBlogSubmit = async (newBlogObj) => {
    try {
      const newBlog = await blogService.create(newBlogObj);
      setBlogs(blogs.concat(newBlog));
      dispatch(
        setNotificationWithTimeout(
          {
            type: 'success',
            content: `a new blog ${newBlog.title} by ${newBlog.author} added`
          },
          5000
        )
      );
    } catch (exception) {
      console.log(exception);
      dispatch(
        setNotificationWithTimeout(
          {
            type: 'error',
            content: exception.response.data.error
          },
          5000
        )
      );
    }
  };

  const handleBlogLike = async (updatedBlogObj) => {
    try {
      const updatedBlog = await blogService.update(updatedBlogObj);
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      );
    } catch (exception) {
      console.log(exception);
      dispatch(
        setNotificationWithTimeout(
          {
            type: 'error',
            content: exception.response.data.error
          },
          5000
        )
      );
    }
  };

  const handleBlogDelete = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (exception) {
      console.log(exception);
      dispatch(
        setNotificationWithTimeout(
          {
            type: 'error',
            content: exception.response.data.error
          },
          5000
        )
      );
    }
  };

  // sort blogs the biggest likes number to the lowest
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notification} />

      {user === null ? (
        <LoginForm onLoginFormSubmit={handleLoginSubmit} />
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button
            onClick={() => {
              setUser(null);
              window.localStorage.removeItem('loggedBlogappUser');
            }}
          >
            logout
          </button>
          <Togglable buttonLabel="new blog" ref={createFormRef}>
            <BlogForm onCreateBlogFormSubmit={handleCreateFormBlogSubmit} />
          </Togglable>
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onBlogLike={handleBlogLike}
              onBlogDelete={handleBlogDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
