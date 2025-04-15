import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { storyCreationState, characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import ChoiceButton from '../components/ChoiceButton';
import styled from 'styled-components';

const storyQuestions = [
  {
    key: 'genre',
    question: '장르를 선택해 주세요.',
    options: ['친구', '가족', '일상', '마법', '영웅', '액션', '고전', '여행', '수수께끼'],
  },
  {
    key: 'place',
    question: '장소를 선택해 주세요.',
    options: ['우주', '왕국', '산', '바다', '학교', '집', '도시', '시골'],
  },
  {
    key: 'mood',
    question: '날씨를 선택해 주세요.',
    options: ['맑음', '흐림', '약간흐림', '비', '눈'],
  },
  {
    key: 'role',
    question: '등장인물을 선택해 주세요.',
    options: ['조력자 있음', '방해자 있음', '둘 다 있음', '둘 다 없음'],
  },
];

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ArrowButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.625rem;
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;
const SliderContainer = styled.div`
  width: 23.75rem;
  overflow: hidden;
`;
const Slider = styled.div`
  display: flex;
  gap: 0.625rem;
  transition: transform 0.3s ease-in-out;
`;
const OptionItem = styled.div`
  width: 6.5rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const StoryQuestionScreen = () => {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useRecoilState(storyCreationState);
  const [characterInfo] = useRecoilState(characterInfoState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const sliderWidth = 21.4;

  const current = storyQuestions[questionIndex];
  const totalPages = Math.ceil(current.options.length / itemsPerPage);

  const handleSelect = (text) => {
    if (current.key === 'role') {
      const helper = text.includes('조력자');
      const villain = text.includes('방해자');
      setStoryData(prev => ({
        ...prev,
        helper,
        villain,
        charID: parseInt(characterInfo[0].id),
      }));
    } else {
      setStoryData(prev => ({
        ...prev,
        [current.key]: text,
      }));
    }

    if (questionIndex < storyQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setPage(0);
    } else {
      navigate('/confirm-story');
    }
  };

  return (
    <BaseScreenLayout
      progressText={`${questionIndex + 1} / ${storyQuestions.length}`}
      progressCurrent={questionIndex + 1}
      progressTotal={storyQuestions.length}
      title="이야기에 대해 말해 주세요."
      subTitle={current.question}
    >
      <Container>
        <ArrowButton onClick={() => setPage(p => p - 1)} disabled={page === 0}>&lt;</ArrowButton>
        <SliderContainer>
          <Slider style={{ transform: `translateX(-${page * sliderWidth}rem)` }}>
            {current.options.map((option) => (
              <OptionItem key={option}>
                <ChoiceButton
                  text={option}
                  onClick={() => handleSelect(option)}
                />
              </OptionItem>
            ))}
          </Slider>
        </SliderContainer>
        <ArrowButton onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>&gt;</ArrowButton>
      </Container>
    </BaseScreenLayout>
  );
};

export default StoryQuestionScreen;
