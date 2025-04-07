import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import styled from 'styled-components';
import ChoiceButton from '../components/ChoiceButton'; // 선택 옵션 버튼 컴포넌트

// 스토리 질문과 각 질문에 대한 선택지 데이터 예시
const storyQuestions = [
  {
    question: '장르를 선택해 주세요.',
    options: [
      { text: '친구', image: '/assets/images/fantasy.jpg' },
      { text: '가족', image: '/assets/images/romance.jpg' },
      { text: '일상', image: '/assets/images/mystery.jpg' },
      { text: '마법', image: '/assets/images/mystery.jpg' },
      { text: '영웅', image: '/assets/images/mystery.jpg' },
      { text: '액션', image: '/assets/images/mystery.jpg' },
      { text: '고전', image: '/assets/images/mystery.jpg' },
      { text: '여행', image: '/assets/images/mystery.jpg' },
      { text: '수수께끼', image: '/assets/images/mystery.jpg' },
    ],
  },
  {
    question: '장소를 선택해 주세요.',
    options: [
      { text: '우주', image: '/assets/images/city.jpg' },
      { text: '왕국', image: '/assets/images/forest.jpg' },
      { text: '산', image: '/assets/images/beach.jpg' },
      { text: '바다', image: '/assets/images/beach.jpg' },
      { text: '학교', image: '/assets/images/beach.jpg' },
      { text: '집', image: '/assets/images/beach.jpg' },
      { text: '도시', image: '/assets/images/beach.jpg' },
      { text: '시골', image: '/assets/images/beach.jpg' },
    ],
  },
  {
    question: '날씨를 선택해 주세요.',
    options: [
      { text: '맑음', image: '/assets/images/dark.jpg' },
      { text: '흐림', image: '/assets/images/bright.jpg' },
      { text: '약간흐림', image: '/assets/images/dreamy.jpg' },
      { text: '비', image: '/assets/images/dreamy.jpg' },
      { text: '눈', image: '/assets/images/dreamy.jpg' },
    ],
  },
  {
    question: '등장인물을 선택해 주세요. (조력자/방해자 여부 포함)',
    options: [
      { text: '조력자 있음', image: '/assets/images/helper.jpg' },
      { text: '방해자 있음', image: '/assets/images/antagonist.jpg' },
      { text: '둘 다 있음', image: '/assets/images/both.jpg' },
      { text: '둘 다 없음', image: '/assets/images/both.jpg' },
    ],
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
  max-width: 100%;
  overflow: hidden;
  margin: 0 auto;
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
  const [questionIndex, setQuestionIndex] = useState(0);
  // 페이지(옵션 세트) 상태
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const sliderWidth = 21.4;

  const currentQuestion = storyQuestions[questionIndex];
  const totalPages = Math.ceil(currentQuestion.options.length / itemsPerPage);

  const handlePrevPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleOptionSelect = (option) => {
    console.log('선택된 옵션:', option.text);
    if (questionIndex < storyQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
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
      subTitle={currentQuestion.question}
      imageSrc={null}
    >
      <Container>
        <ArrowButton onClick={handlePrevPage} disabled={page === 0}>
          &lt;
        </ArrowButton>
        <SliderContainer>
          <Slider style={{ transform: `translateX(-${page * sliderWidth}rem)` }}>
            {currentQuestion.options.map((option) => (
              <OptionItem key={option.text}>
                <ChoiceButton
                  text={option.text}
                  imageSrc={option.image}
                  onClick={() => handleOptionSelect(option)}
                />
              </OptionItem>
            ))}
          </Slider>
        </SliderContainer>
        <ArrowButton onClick={handleNextPage} disabled={page === totalPages - 1}>
          &gt;
        </ArrowButton>
      </Container>
    </BaseScreenLayout>
  );
};

export default StoryQuestionScreen;