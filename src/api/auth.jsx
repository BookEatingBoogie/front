import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function signupUser({ userID, password, userName, phoneNum }) {
  return api.post('/api/auth/signup', { userID, password, userName, phoneNum });
}

export function loginUser({ userID, password }) {
  return api.post('/api/auth/login', { userID, password });
}