import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import usersService from '../services/users';

const UserDetail = () => {
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    usersService.getAll().then((users) => {
      const userFound = users.find((u) => u.id === id);
      setUserDetail(userFound);
    });
  }, [id]);

  if (!userDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{userDetail.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {userDetail.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetail;
