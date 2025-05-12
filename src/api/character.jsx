import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// payload: { charName: string, userImg: string }
export function postCharacter(payload) {
  return api.post('/character', payload);
}