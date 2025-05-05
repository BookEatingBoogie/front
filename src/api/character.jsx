import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 선택된 캐릭터 정보를 서버에 전송
 * @param {object} character – Recoil 에서 가져온 character 객체
 * @returns {Promise<AxiosResponse>}
 */
export function postCharacter(character) {
  return api.post('/api/character', character);
}