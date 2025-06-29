import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://192.168.1.8:5000/api', // change to your backend IP
  headers: {
    'Content-Type': 'application/json',
  },
});

