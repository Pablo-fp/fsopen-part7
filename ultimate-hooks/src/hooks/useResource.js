import { useState, useEffect } from 'react';
import axios from 'axios';

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get(baseUrl).then((response) => {
      setResources(response.data);
    });
  }, [baseUrl]);

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource);
    setResources(resources.concat(response.data));
    return response.data;
  };

  const service = { create };

  return [resources, service];
};

export default useResource;
