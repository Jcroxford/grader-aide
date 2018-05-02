import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    authorization: window.localStorage.getItem('authorization')
  }
});
