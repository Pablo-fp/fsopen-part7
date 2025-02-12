import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const getCountry = async (name) => {
  try {
    const response = await axios.get(`${baseUrl}/name/${name}`);
    return {
      data: response.data,
      found: true
    };
  } catch (error) {
    return { found: false };
  }
};

export default getCountry;
