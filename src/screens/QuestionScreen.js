import React, { useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import MicSpeakButton from '../components/MicSpeakButton';
import dokkaebiWhere from '../assets/images/dokkaebi_where.png';
import mainCharactor from '../assets/images/mainCharactor.png';

const RecordingText = styled.div`
  color: #ffcc00; /* 노란색 */
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  white-space: pre-line;
`;

// STT 결과 박스
const STTBox = styled.div`
  min-height: 120px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: rgb(255, 255, 255, 0.2);
  padding: 10px;
  text-align: left;
  font-size: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
  width: 100%;
`;

// 버튼 스타일
const Button = styled.button`
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  z-index: 1
`;

// "기록 완료" 버튼
const CompleteButton = styled(Button)`
  border: 2px solid #fff;
  background-color: #fff;
  color: black;
`;

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
  const [isRecording, setIsRecording] = useState(false);

  // "녹음(말하기)" 버튼 (STT)
  const handleMicClick = () => {
    setIsRecording(true);
    // TODO: 실제 STT 로직
    alert('음성 인식 시작(예시)');
  };

  // "기록 완료" 버튼 -> 다음 질문 or 다음 화면
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
      // 모든 질문 완료 -> 이동
      navigate('/confirm-info');
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

      {/* 1) 처음 상태(isRecording=false) => "눌러서 말하기" 버튼만 */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {!isRecording && (
        <MicSpeakButton
          label="눌러서 말하기"
          onClick={handleMicClick}
        />
      )}
      </div>

      {/* 2) 녹음 중(isRecording=true) => 노란 안내문 + STT박스 + "기록 완료" 버튼 */}
      {isRecording && (
        <>
          <RecordingText>{"주인공에 대해 입력하고 있어요.\n설명이 끝나면 아래 기록 완료 버튼을 눌러주세요."}</RecordingText>
          <STTBox>
            {transcript || '말하면 여기에 표시될 예정입니다.'}
          </STTBox>
          <CompleteButton onClick={handleComplete}>기록 완료</CompleteButton>
        </>
      )}
    </BaseScreenLayout>
  );
};

export default QuestionScreen;