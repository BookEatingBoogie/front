import { atom } from 'recoil';

export const characterInfoState = atom({
  key: 'characterInfo',
  default: [{
    id:'0', //백에서 주는 저장명
    name: '서영이', //우리가 정해준 이름
    age: '5', //나이
    gender: '몰라', //성별
    job: '다람쥐', //직업
    speciality: ' 돈을 잘 벌어', //특징
    note: '사람이로 변했다.', //기타사항, 글로 생긴거 설명할때 여기로
    userImg:'', //아이 사진 보내는거
    charImg: '', // 캐릭터 이미지 받는거
  },
  {
    id:'1', //백에서 주는 저장명
    name: '유원이', //우리가 정해준 이름
    age: '7', //나이
    gender: '여성', //성별
    job: '마법사', //직업
    speciality: '마법을 잘 써', //특징
    note: '검은 고양이 네로와 모험을 떠났어', //기타사항
    userImg:'', //아이 사진 보내는거
    charImg: '', // 캐릭터 이미지 받는거
  },
]
});

export const storyInfoState = atom({
  key:'storyInfo',
  default:{
    id:'0', //백에서 주는 스토리 번호
    conversation:'', //대화내용을 가리기키는 번호
    title:'이야기 제목', // 동화 제목
    date:'',  //생성일
    favorite: '', //즐겨찾기 여부
    summary:'', //요약내용
    img: [], //삽화배열 ** 변경 가능**
  },
},
);

export const userInfoState = atom({
  key:'userInfo',
  default:[{
    id:'',
    password:'',
    nickname:'',
    pNumber:'',
  }]
})

export const conversationState = atom({
  key:'conversation',
  default:[{
    conversationId:'',// 메세지 한줄한줄이 들어있는 대화 한 묶음
    userId:'',
    characterId:'',
    qType:'', //질문 종류 
  }]
})

export const messageState = atom({
  key:'message',
  default:[{
    conversationId:'',
    speaker:'', //user, bot 
    message:'', // 각각의 메시지 한줄 
    timestamp:'', // 사용한 시간대 
  }]
})
