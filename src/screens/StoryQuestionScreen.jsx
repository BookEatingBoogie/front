import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { storyCreationState, characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import styled from 'styled-components';
import { postStoryStart } from '../api/story';
import cloudMkGif from '../assets/images/cloudmk4.gif'; // 회의 후 결정될 gif
import Lottie from 'react-lottie-player';
import thinkAnimation from '../assets/thinkAnimation.json';

const storyQuestions = [
  {
    key: 'genre',
    question: '장르를 선택해 주세요.',
    options: ['일상', '마법', '영웅', '액션', '모험'],
  },
  {
    key: 'place',
    question: '장소를 선택해 주세요.',
    options: ['우주', '왕국', '산', '바다', '학교', '집'],
  },
];

const OptionsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 13.75rem;
  margin-top: -4rem;
  z-index: 2;
`;

const OptionItem = styled.div`
  position: absolute;
`;

const CloudButton = styled.div`
  width: 6.5rem;
  height: 6.5rem;
  background: url(${props => props.gif}) no-repeat center/contain;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

export default function StoryQuestionScreen() {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useRecoilState(storyCreationState);
  const [characterInfo] = useRecoilState(characterInfoState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const audioRef = useRef(null);

  const current = storyQuestions[questionIndex];

  // 옵션 위치 계산
  useEffect(() => {
    const count = current.options.length;
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push([r, c]);
      }
    }
    const shuffled = cells.sort(() => Math.random() - 0.5).slice(0, count);
    const newPos = shuffled.map(([r, c]) => {
      const padX = cellW * 0.1;
      const padY = cellH * 0.1;
      const left = c * cellW + padX + Math.random() * (cellW - 2 * padX);
      const top = r * cellH + padY + Math.random() * (cellH - 2 * padY);
      return { left: `${left}%`, top: `${top}%` };
    });
    setPositions(newPos);
  }, [questionIndex]);

  // TTS: 현재 질문 읽어주기
  useEffect(() => {
    const speak = async () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      try {
        const res = await fetch('http://localhost:5001/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: current.question })
        });
        if (!res.ok) throw new Error('TTS 요청 실패');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
      } catch (err) {
        console.error('TTS 에러:', err);
      }
    };
    speak();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [current.question]);

  const handleSelect = async (option) => {
    const key = current.key;
    const charID = parseInt(characterInfo[0].id, 10);

    setStoryData(prev => ({
      ...prev,
      ...(key === 'genre' && { charID, genre: option }),
      ...(key === 'place' && { place: option }),
    }));

    if (questionIndex < storyQuestions.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      try {
        const payload = {
          charID,
          genre: storyData.genre,
          place: option,
        };
        const { data } = await postStoryStart(payload);
        setStoryData(prev => ({
          ...prev,
          story: data.story,
          image: data.imageUrl,
          choices: data.choices,
        }));
        navigate('/confirm-story');
      } catch (err) {
        console.error(err);
        alert('기초 스토리 생성 중 오류가 발생했습니다.');
        navigate('/confirm-story');
      }
    }
  };

  return (
    <BaseScreenLayout
      progressText={`${questionIndex + 1} / ${storyQuestions.length}`}
      progressCurrent={questionIndex + 1}
      progressTotal={storyQuestions.length}
      title={current.question}
      subTitle="이야기에 대해 말해 주세요."
      // imageSrc 제거
    >
      <OptionsContainer>
        {current.options.map((opt, idx) => (
          <OptionItem key={opt} style={positions[idx]}>
            <CloudButton gif={cloudMkGif} onClick={() => handleSelect(opt)}>
              {opt}
            </CloudButton>
          </OptionItem>
        ))}
      </OptionsContainer>

      {/* thinkAnimation.json Lottie */}
      <Lottie
        loop
        animationData={thinkAnimation}
        play
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '22.5rem',
          maxWidth: '100%',
          height: 'auto',
          bottom: '-22rem', //////
          zIndex: 1
        }}
      />
    </BaseScreenLayout>
  );
}