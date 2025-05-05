import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 첫 번째 스토리 생성 요청
 */
export function postStoryStart(payload) {
  return api.post('/gpt/story', payload);
}

/**
 * 다음 스토리 생성 요청
 * @param {{ charID: number, choice: string, step: number }} payload
 */
export function postStoryNext(payload) {
  return api.post('/gpt/story/next', payload);
}
