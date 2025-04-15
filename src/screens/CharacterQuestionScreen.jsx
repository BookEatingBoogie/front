import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import MicSpeakButton from '../components/MicSpeakButton';

const baseURL = 'http://localhost:8080';
const totalQuestions = 8; // 7개의 질문 + 1번째 최종 호출

// fallback 질문 배열 (인덱스 0~6)
const fallbackQuestions = [
  '주인공 이름이 뭐야?',
  '주인공은 몇 살이야?',
  '주인공은 남자야 여자야?',
  '주인공은 어떤 성격을 가졌어?',
  '주인공이 주로 하는 일은 뭐가 있을까?(직업)',
  '주인공의 능력은 뭐야?',
  '추가 질문: (랜덤 extra)',
];

// 최종 fallback 캐릭터 정보 (마지막 호출 실패 시 참고)
const finalFallbackCharacter = {
  id: '2',
  name: '새로운 캐릭터',
  age: '6',
  gender: '여성',
  job: '마법사',
  speciality: '마법을 잘 써',
  note: '추가 설명 없음',
  ability: '',
};

const CharacterQuestionScreen = () => {
  const navigate = useNavigate();
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  // 초기 질문 로드 : 인덱스 0 질문을 백엔드에서 GET 방식으로 받아옴
  const fetchInitialQuestion = async () => {
    try {
      const response = await fetch(`${baseURL}/gpt/character`);
      if (!response.ok) throw new Error('질문 데이터를 받아올 수 없습니다.');
      // 백엔드가 첫 질문(문자열)을 반환한다고 가정합니다.
      const questionText = await response.json();
      setCurrentQuestion(questionText);
    } catch (error) {
      console.error("초기 질문 로드 오류:", error);
      setCurrentQuestion(fallbackQuestions[0]);
    }
  };

  useEffect(() => {
    fetchInitialQuestion();
  }, []);

  // TTS 처리 : 현재 질문 텍스트를 음성으로 재생
  const playTTS = async (text) => {
    try {
      const response = await fetch("http://localhost:5001/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();
    } catch (error) {
      console.error("TTS 오류:", error);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      playTTS(currentQuestion);
    }
  }, [currentQuestion]);

  // 음성 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      mediaRecorderRef.current.start();
      setHasStartedRecording(true);
    } catch (error) {
      console.error("녹음 실패:", error);
    }
  };

  // 녹음 중지 및 STT 처리
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
        try {
          const response = await fetch('http://localhost:3001/api/google-stt', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          await completeRecording(data.transcript);
        } catch (err) {
          console.error("STT 오류:", err);
        }
      });
      setHasStartedRecording(false);
    }
  };

  // 사용자의 답변을 백엔드에 전송하는 함수
  const sendAnswerToBackend = async (answerText) => {
    try {
      const payload = { userContent: answerText };
      const response = await fetch(`${baseURL}/gpt/character`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('답변 전송 실패');
      // 질문 인덱스 0~6: 다음 질문 문자열, 인덱스 7: 최종 캐릭터 정보를 JSON 객체(또는 문자열)로 반환
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("답변 전송 오류:", err);
      return null;
    }
  };

  // 녹음 결과(STT 텍스트)를 처리하는 함수
  const completeRecording = async (text) => {
    // 질문 인덱스 0~6까지는 기존 캐릭터 정보를 업데이트합니다.
    if (questionIndex < totalQuestions - 1) {
      const updatedCharacter = { ...characterInfo[0] };
      if (questionIndex === 0) updatedCharacter.name = text;
      else if (questionIndex === 1) updatedCharacter.age = text;
      else if (questionIndex === 2) updatedCharacter.gender = text;
      else if (questionIndex === 3) updatedCharacter.speciality = text;
      else if (questionIndex === 4) updatedCharacter.job = text;
      else if (questionIndex === 5) updatedCharacter.ability = text;
      else if (questionIndex === 6) updatedCharacter.note = text;
      
      setCharacterInfo([updatedCharacter, ...characterInfo.slice(1)]);
      
      const responseFromBackend = await sendAnswerToBackend(text);
      // 백엔드가 정상 응답을 주지 않으면 fallback 질문 사용
      const nextQuestion = responseFromBackend ? responseFromBackend : fallbackQuestions[questionIndex + 1];
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(nextQuestion);
    } else {
      // 마지막 호출: 인덱스 7
      // 최종 호출에서는 백엔드에서 최종 캐릭터 정보를 반환받습니다.
      const responseFromBackend = await sendAnswerToBackend(text);
      if (responseFromBackend) {
        // 최종 결과를 navigate의 state로 전달합니다.
        navigate('/confirm-info', { state: { finalCharacter: responseFromBackend } });
      } else {
        navigate('/confirm-info', { state: { finalCharacter: finalFallbackCharacter } });
      }
    }
  };

  return (
    <BaseScreenLayout
      progressText={`${questionIndex + 1} / ${totalQuestions}`}
      progressCurrent={questionIndex + 1}
      progressTotal={totalQuestions}
      title="주인공에 대해 묘사 해주세요."
      subTitle={currentQuestion}
      imageSrc={silhouetteImg}
      imageBottom={0}
    >
      <div onMouseDown={() => !hasStartedRecording && startRecording()}>
        <MicSpeakButton onComplete={stopRecording} />
      </div>
    </BaseScreenLayout>
  );
};

export default CharacterQuestionScreen;