import { atom } from 'recoil';
import testImg from '../assets/images/마법사 유원이.webp';
import 서영이 from '../assets/images/서영이와 다람쥐.webp'
import 유원이 from '../assets/images/마법사 유원이.webp';
import 민지 from '../assets/images/민지와 눈내리는 마을.webp';


export const characterInfoState = atom({
  key: 'characterInfo',
  default: [
    {
      id: '0',
      name: '서영이',
      age: '5',
      gender: '몰라',
      job: '다람쥐',
      speciality: '돈을 잘 벌어',
      ability:'슈퍼맨',
      note: '사람으로 변했다.',
      img: 서영이,
      userImg: '',
    },
    {
      id: '1',
      name: '유원이',
      age: '7',
      gender: '여성',
      job: '마법사',
      speciality: '마법을 잘 써',//성격
      ability:'슈퍼맨',
      note: '검은 고양이 네로와 모험을 떠났어',
      img: 유원이,
      userImg:'',
    },
    {
      id: '2',
      name: '민지',
      age: '5',
      gender: '여성',
      job: '꼬마소녀',
      speciality: '동물과 대화가 가능해',
      ability:'슈퍼맨',
      note: '마음씨가 착해서 사람 뿐 아니라 동물에 대해서도 공감력이 좋다.',
      img: 민지,
      userImg:'',
    },
  ],
});

export const storyCreationState = atom({
  key: 'storyCreationState',
  default: {
    charID: 0,         // 선택된 캐릭터의 ID
    genre: '',            // 장르
    place: '',            // 장소 (예: 우주, 왕국...)
    mood: '',             // 날씨 (예: 맑음, 흐림...)
    helper: false,        // 조력자 유무
    villain: false        // 방해자 유무
  },
});

export const storyInfoState = atom({
  key: 'storyInfo',
  default: [
    {
      id: '1',
      title: '마법사 유원이',
      date: '2025.02.01',
      favorite: 'false',
      summary: '마법사 유원이의 네로와 함께하는 모험 이야기',
      img: Array(10).fill(유원이),
      cover: testImg,
      characters: ['유원이'], // ✅ 필수
    },
  ],
});

export const userInfoState = atom({
  key: 'userInfo',
  default: [{
    id: 'qwer',
    password: '',
    nickname: '',
    pNumber: '',
  }]
});

export const conversationState = atom({
  key:'conversation',
  default:[{
    conversationId:'',// 메세지 한줄한줄이 들어있는 대화 한 묶음
    userId:'',
    characterId:'',
    qType:'', //질문 종류 
  }]
});

export const messageState = atom({
  key: 'message',
  default: [{
    conversationId: '',
    speaker: '',
    message: '',
    timestamp: '',
  }]
});

export const favoriteStoryIdsState = atom({
  key: 'favoriteStoryIdsState',
  default: [],
});
