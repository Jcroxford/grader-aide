import axios from 'axios';

export default function() {
  return axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      authorization: window.localStorage.getItem('authorization')
    }
  });
}
