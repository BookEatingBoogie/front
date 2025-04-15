import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import MicSpeakButton from '../components/MicSpeakButton';

const CharacterQuestionScreen = () => {
  const navigate = useNavigate();
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  const characterQuestions = [
    '주인공 이름이 뭐야?',
    '주인공은 몇 살이야?',
    '주인공은 남자야 여자야?',
    '주인공은 어떤 성격을 가졌어?',
    '주인공이 주로 하는 일은 뭐가 있을까?(직업)',
  ];

  const playTTS = async (text) => {
    try {
      const response = await fetch("http://localhost:5001/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();
    } catch (error) {
      console.error("TTS 오류:", error);
    }
  };

  useEffect(() => {
    playTTS(characterQuestions[questionIndex]);
  }, [questionIndex]);

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
    } catch (error) {
      console.error("녹음 실패:", error);
    }
  };

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
          completeRecording(data.transcript);
        } catch (err) {
          console.error("STT 오류:", err);
        }
      });
      setHasStartedRecording(false);
    }
  };

  const completeRecording = (text) => {
    const updatedCharacter = { ...characterInfo[0] };
    if (questionIndex === 0) updatedCharacter.name = text;
    else if (questionIndex === 1) updatedCharacter.age = text;
    else if (questionIndex === 2) updatedCharacter.gender = text;
    else if (questionIndex === 3) updatedCharacter.speciality = text;
    else if (questionIndex === 4) updatedCharacter.job = text;

    setCharacterInfo([updatedCharacter, ...characterInfo.slice(1)]);

    if (questionIndex < characterQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      navigate('/confirm-info');
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
      <div onMouseDown={() => !hasStartedRecording && startRecording()}>
        <MicSpeakButton onComplete={stopRecording} />
      </div>
    </BaseScreenLayout>
  );
};

export default CharacterQuestionScreen;