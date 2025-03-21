import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import MicSpeakButton from '../components/MicSpeakButton';
import dokkaebiWhere from '../assets/images/dokkaebi_where.png';
import mainCharactor from '../assets/images/mainCharactor.png';

const QuestionScreen = ({ questionType = 'character' }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  // 캐릭터 / 스토리 질문
  const characterQuestions = [
    '주인공 이름이 뭐야?',
    '주인공은 몇 살이야?',
    '주인공은 어떻게 생겼어?(어떤 모습이야?) 동물이나 로봇이어도 좋아!',
    '주인공(이름)은 어떤 성격을 가졌어?',
    '주인공이 주로 하는 일은 뭐가 있을까?(직업)',
    '주인공에게 특별한 능력이 있을까?',
  ];

  const storyQuestions = [
    '주인공은 어디에 있어?',
    '주인공한테 무슨 일이 생겼어! 무슨 일이 일어났을까?',
    '주인공은 어떻게 문제를 해결할까?',
    '주인공은 누구와 문제를 해결할까?',
    '새로 만나거나 알게 되는 존재가 있을까?',
  ];

  // 질문 배열 선택
  const questions =
    questionType === 'character' ? characterQuestions : storyQuestions;

  // 현재 질문 인덱스, STT 결과
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');

  // "녹음(말하기)" 상태
  const [isRecording, setIsRecording] = useState(false); // 나중에 stt 백으로 보낼때 사용가능할듯
  
  const handleComplete = () => {
    // userInfo에 현재 transcript 저장
    setUserInfo({
      ...userInfo,
      answers: [...(userInfo.answers || []), transcript],
    });
    setTranscript('');
    setIsRecording(false);

    // 질문이 남았으면 다음 질문, 없으면 confirm 등으로 이동
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      if (questionType === 'character') {
        // 캐릭터 질문 완료 -> /confirm-info
        navigate('/confirm-info');
      } else {
        // 스토리 질문 완료 -> /confirm-story
        navigate('/confirm-story');
      }
    }  
  };

  let imageSrc = silhouetteImg;
  if (questionType === 'story') {
    // 예: questionIndex 0 -> dokkaebiTime, 1 -> dokkaebiContent, ...
    switch (questionIndex) {
      case 0:
        imageSrc = dokkaebiWhere; // "시간적 배경" 질문
        break;
      case 1:
        imageSrc = mainCharactor; // "공간적 배경" 질문
        break;
      case 2:
        imageSrc = mainCharactor; // "누구와 함께" 질문 (예시)
        break;
      default:
        imageSrc = mainCharactor;
        break;
    }
  }

  return (
    <BaseScreenLayout
      progressText = {`${questionIndex + 1} / ${questions.length}`}
      progressCurrent={questionIndex + 1}
      progressTotal={questions.length}
      title={questionType === 'character' 
        ? '주인공에 대해 묘사 해주세요.' 
        : '이야기에 대해 말해 주세요.'}
      // 서브타이틀 => 현재 질문 텍스트
      subTitle={questions[questionIndex]}
      // 하단 이미지는 실루엣
      imageSrc={imageSrc}
      imageBottom={0}
    >

        <MicSpeakButton 
        key={questionIndex}
        onComplete={handleComplete}
        />
    </BaseScreenLayout>
  );
};

export default QuestionScreen;