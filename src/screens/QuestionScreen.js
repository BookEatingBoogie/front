import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { userInfoState, conversationState, messageState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import MicSpeakButton from '../components/MicSpeakButton';
import dokkaebiWhere from '../assets/images/dokkaebi_where.png';
import mainCharactor from '../assets/images/mainCharactor.png';

const QuestionScreen = ({ questionType = 'character' }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [conversation, setConversation] = useRecoilState(conversationState);
  const [messages, setMessages] = useRecoilState(messageState);

  // 질문 배열
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
  const questions =
    questionType === 'character' ? characterQuestions : storyQuestions;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false); // 나중에 STT 백엔드 연동 시 사용

  // handleComplete: 답변 저장 및 대화/메시지 상태 업데이트 후 다음 질문으로 이동
  const handleComplete = () => {
    // 1. 새로운 대화(conversation)를 생성하거나 기존 대화 사용
    let convId;
    if (questionIndex === 0) {
      // 첫 질문이면 새로운 대화 생성
      const newConv = {
        conversationId: `conv-${Date.now()}`,
        userId: userInfo.id || 'defaultUser',
        characterId: '11',
        qType: questionType,
      };
      setConversation(prev => {
        const updated = [...prev, newConv];
        console.log('Updated conversationState:', updated);
        return updated;
      });
      convId = newConv.conversationId;
    } else {
      // 첫 질문이 아니라면, 마지막 대화의 ID 사용
      convId = conversation[conversation.length - 1].conversationId;
    }

    // 2. messageState에 새 메시지 추가
    const newMessage = {
      conversationId: convId,
      speaker: 'user',
      message: transcript,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log('Updated messageState:', updated);
      return updated;
    });

    // 3. 상태 초기화
    setTranscript('대화내용'); //message 초기화를 위해 진짜로 쓸때는 빈칸추천천.
    setIsRecording(false);

    // 4. 다음 질문으로 이동 (모든 질문이 끝나면 해당 confirm 화면으로 이동)
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      if (questionType === 'character') {
        navigate('/confirm-info');
      } else {
        navigate('/confirm-story');
      }
    }
  };

  let imageSrc = silhouetteImg;
  if (questionType === 'story') {
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