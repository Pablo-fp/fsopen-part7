import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useMatch,
  Navigate
} from 'react-router-dom';
import { useField } from './hooks';

const Menu = ({ anecdotes }) => {
  const padding = {
    paddingRight: 5
  };
  return (
    <div>
      <Link to="/" style={padding}>
        Anecdotes
      </Link>
      <Link to="/create" style={padding}>
        Create New
      </Link>
      <Link to="/about" style={padding}>
        About
      </Link>
    </div>
  );
};

const Anecdote = ({ anecdote }) => {
  return (
    <p>
      <h2>{anecdote?.content}</h2>
      <div>has {anecdote?.votes} votes</div>
      <div>for more info see {anecdote?.info}</div>
    </p>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <p>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </p>
      ))}
    </ul>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{' '}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{' '}
    for the source code.
  </div>
);

const CreateNew = ({ addNew, setNotification }) => {
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
    setNotification(`a new anecdote ${content.value} created!`);
    setTimeout(() => {
      setNotification('');
    }, 5000);
  };

  const handleReset = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };

  // Destructure to avoid passing the reset function to the input elements
  const { reset: resetContent, ...contentInput } = content;
  const { reset: resetAuthor, ...authorInput } = author;
  const { reset: resetInfo, ...infoInput } = info;

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>
        <div>
          author
          <input {...authorInput} />
        </div>
        <div>
          url for more info
          <input {...infoInput} />
        </div>
        <button type="submit">create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);

  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  const AnecdoteWrapper = () => {
    const { id } = useParams();
    const anecdote = anecdoteById(Number(id));
    return <Anecdote anecdote={anecdote} />;
  };

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Router>
        <Menu anecdotes={anecdotes} />
        {notification && (
          <div
            style={{
              border: '3px solid red',
              padding: '10px',
              margin: '10px 0',
              display: 'inline-block'
            }}
          >
            {notification}
          </div>
        )}
        <Routes>
          <Route path="/anecdotes/:id" element={<AnecdoteWrapper />} />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route
            path="/create"
            element={
              <CreateNew addNew={addNew} setNotification={setNotification} />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
