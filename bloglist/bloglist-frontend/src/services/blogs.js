import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL || '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getOne = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (updatedObj) => {
  const response = await axios.put(`${baseUrl}/${updatedObj.id}`, updatedObj);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const addComment = async (id, commentObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    commentObject,
    config
  );
  return response.data;
};

const deleteComment = async (blogId, commentId) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.delete(
    `${baseUrl}/${blogId}/comments/${commentId}`,
    config
  );
  return response.data;
};

export default {
  getAll,
  getOne,
  create,
  update,
  setToken,
  remove,
  addComment,
  deleteComment
};
