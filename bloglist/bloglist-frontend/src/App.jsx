import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import Users from './components/Users';
import UserDetail from './components/UserDetail';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import { setNotificationWithTimeout } from './reducers/notificationReducer';
import {
  initializeBlogs,
  createBlog,
  updateBlog,
  removeBlog
} from './reducers/blogReducer';
import { setUser, clearUser } from './reducers/userReducer';

const App = () => {
  /* Redux */
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  /* Refs */
  const createFormRef = useRef();

  /* Effects */
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const localUser = JSON.parse(loggedUserJSON);
      dispatch(setUser(localUser));
      blogService.setToken(localUser.token);
    }
  }, [dispatch]);

  /* Handle */
  const handleLoginSubmit = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      dispatch(setUser(user));
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
      await dispatch(createBlog(newBlogObj));
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
      dispatch(updateBlog(updatedBlog));
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
      dispatch(removeBlog(blogId));
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
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <BrowserRouter>
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
                dispatch(clearUser());
                window.localStorage.removeItem('loggedBlogappUser');
              }}
            >
              logout
            </button>
            <nav>
              <Link to="/">blogs</Link> | <Link to="/users">users</Link>
            </nav>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Togglable buttonLabel="new blog" ref={createFormRef}>
                      <BlogForm
                        onCreateBlogFormSubmit={handleCreateFormBlogSubmit}
                      />
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
                  </>
                }
              />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetail />} />
            </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
