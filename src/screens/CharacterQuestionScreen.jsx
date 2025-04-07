import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { userInfoState, conversationState, messageState, characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import MicSpeakButton from '../components/MicSpeakButton';

const CharacterQuestionScreen = () => {
  const navigate = useNavigate();
  const [userInfo] = useRecoilState(userInfoState);
  const [conversation, setConversation] = useRecoilState(conversationState);
  const [messages, setMessages] = useRecoilState(messageState);
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);

  // 캐릭터 질문 배열
  const characterQuestions = [
    '주인공 이름이 뭐야?',
    '주인공은 몇 살이야?',
    '주인공은 남자야 여자야?',
    '주인공은 어떤 성격을 가졌어?',
    '주인공이 주로 하는 일은 뭐가 있을까?(직업)',
  ];
  const [questionIndex, setQuestionIndex] = useState(0);

  // 녹음 관련 상태와 ref
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  // 녹음 시작: 사용자의 마이크에 접근하여 MediaRecorder 생성
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });
      mediaRecorderRef.current.start();
      setHasStartedRecording(true);
      console.log("녹음 시작");
    } catch (error) {
      console.error("녹음 시작 실패:", error);
    }
  };

  // 녹음 종료: MediaRecorder를 멈추고 녹음된 음성을 백엔드로 전송
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        try {
          const response = await fetch('http://localhost:3001/api/google-stt', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          const recognizedText = data.transcript; // 백엔드에서 반환한 전사 결과
          completeRecording(recognizedText);
        } catch (error) {
          console.error("STT 처리 중 오류:", error);
        }
      });
      setHasStartedRecording(false);
      console.log("녹음 종료");
    }
  };

  // 전사 결과를 받아 대화와 메시지 상태 업데이트 및 atoms(캐릭터 정보) 업데이트
  const completeRecording = (finalTranscript) => {
    // 우선 대화와 메시지 업데이트
    let convId;
    if (questionIndex === 0) {
      const newConv = {
        conversationId: `conv-${Date.now()}`,
        userId: userInfo.id || 'defaultUser',
        characterId: '11',
        qType: 'character',
      };
      setConversation(prev => [...prev, newConv]);
      convId = newConv.conversationId;
    } else {
      convId = conversation[conversation.length - 1].conversationId;
    }
    const newMessage = {
      conversationId: convId,
      speaker: 'user',
      message: finalTranscript,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);

    // 그리고 characterInfoState 업데이트: 질문 순서에 따라 각 필드를 업데이트
    setCharacterInfo(prev => {
      // 첫 번째 캐릭터 정보를 복사하여 업데이트
      const updatedCharacter = { ...prev[0] };
      if (questionIndex === 0) {
        updatedCharacter.name = finalTranscript;
      } else if (questionIndex === 1) {
        updatedCharacter.age = finalTranscript;
      } else if (questionIndex === 2) {
        updatedCharacter.gender = finalTranscript;
      } else if (questionIndex === 3) {
        updatedCharacter.speciality = finalTranscript;
      } else if (questionIndex === 4) {
        updatedCharacter.job = finalTranscript;
      }
      return [updatedCharacter, ...prev.slice(1)];
    });

    // 다음 질문으로 이동하거나, 모든 질문이 끝났으면 확인 화면으로 이동
    if (questionIndex < characterQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      navigate('/confirm-info');
    }
  };

  // MicSpeakButton이 렌더링되는 래퍼(div)에 onMouseDown을 부착하여 첫 클릭 시 녹음 시작
  const handleWrapperMouseDown = () => {
    if (!hasStartedRecording) {
      startRecording();
    }
  };

  // MicSpeakButton의 onComplete 콜백: 두 번째 클릭 시 녹음 종료 처리
  const handleMicComplete = () => {
    if (hasStartedRecording) {
      stopRecording();
    }
  };

  return (
    <BaseScreenLayout
      progressText={`${questionIndex + 1} / ${characterQuestions.length}`}
      progressCurrent={questionIndex + 1}
      progressTotal={characterQuestions.length}
      title="주인공에 대해 묘사 해주세요."
      subTitle={characterQuestions[questionIndex]}
      imageSrc={silhouetteImg}
      imageBottom={0}
    >
      <div onMouseDown={handleWrapperMouseDown}>
        <MicSpeakButton onComplete={handleMicComplete} />
      </div>
    </BaseScreenLayout>
  );
};

export default CharacterQuestionScreen;