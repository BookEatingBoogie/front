import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});


export function postStoryIntro({ genre, place, characterId }) {
  // 최초 생성: /intro
  return api.post('/intro', { genre, place, characterId });
}

export function postStoryNext({ choice }) {
  // 이후 스텝: /story
  return api.post('/story', { choice });
}