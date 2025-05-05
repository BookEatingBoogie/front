import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { storyCreationState, characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import styled from 'styled-components';
import { postStoryStart } from '../api/story';
import dokwhere from '../assets/images/dokkaebi_where.png';
import cloudMkGif from '../assets/images/cloudmk4.gif'; //mk 234중 회의에서 정해야함함

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
  height: 300px; /* 필요에 따라 조절 */
`;

const OptionItem = styled.div`
  position: absolute;
`;

const CloudButton = styled.div`
  width: 6.5rem;
  height: 6.5rem;
  background: url(${cloudMkGif}) no-repeat center/contain;
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
    transform: scale(1.05);
  }
`;

export default function StoryQuestionScreen() {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useRecoilState(storyCreationState);
  const [characterInfo] = useRecoilState(characterInfoState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [positions, setPositions] = useState([]);
  const current = storyQuestions[questionIndex];

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
      title="이야기에 대해 말해 주세요."
      subTitle={current.question}
      imageSrc={dokwhere}
    >
      <OptionsContainer>
        {current.options.map((opt, idx) => (
          <OptionItem key={opt} style={positions[idx]}>
            <CloudButton onClick={() => handleSelect(opt)}>
              {opt}
            </CloudButton>
          </OptionItem>
        ))}
      </OptionsContainer>
    </BaseScreenLayout>
  );
}