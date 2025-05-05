import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { storyCreationState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import styled from 'styled-components';
import squirrelImg from '../assets/images/서영이와 다람쥐.webp';
// import { postStoryStart, postStoryNext } from '../api/story'; // 백 연결 시 해제

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  margin: 2rem auto 0;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  background-image: ${props => `url("${props.image || squirrelImg}")`};
  background-size: cover;
  background-position: center;
  &::before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const ChoicesOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TransparentButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.75);
  color: #000;
  border: 1px solid rgba(255,255,255, 1);
  border-radius: 0.5rem;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

export default function InteractiveStoryScreen() {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useRecoilState(storyCreationState);
  const { history = [], choices = [], step = 0, charID, genre, place } = storyData;

  useEffect(() => {
    // --- 최초 API 호출 (백 연결 후 주석 해제) ---
    /*
    if (step === 0) {
      postStoryStart({ charID, genre, place })
        .then(({ data }) => {
          setStoryData(prev => ({
            ...prev,
            history: [data.story],
            story: data.story,
            image: data.imageUrl,
            choices: data.choices,
            step: 1,
          }));
        })
        .catch(() => alert('스토리 생성에 실패했습니다.'));
    }
    */
  }, [step, charID, genre, place, setStoryData]);

  const handleChoice = (choice) => {
    // --- 다음 API 호출 (백 연결 후 주석 해제) ---
    /*
    if (step < 5) {
      postStoryNext({ charID, choice, step })
        .then(({ data }) => {
          setStoryData(prev => ({
            ...prev,
            history: [...prev.history, data.story],
            story: data.story,
            image: data.imageUrl,
            choices: data.choices,
            step: prev.step + 1,
          }));
        })
        .catch(() => alert('다음 스토리 생성에 실패했습니다.'));
      return;
    }
    */

    // 더미 데이터 업데이트
    setStoryData(prev => ({
      ...prev,
      history: [...prev.history, `선택: ${choice}`],
      story: `다음 이야기 (더미): ${choice} 이후의 내용입니다.`,
      image: squirrelImg,
      choices: ['선택지 A', '선택지 B', '선택지 C'],
      step: prev.step + 1,
      selectedChoice: choice,
    }));

    if (step >= 5) {
      navigate('/reading');
    }
  };

  const currentStory = history.length
    ? history[history.length - 1]
    : '스토리가 준비되는 중입니다...';

  return (
    <BaseScreenLayout
      progressText={`${step} / 5`}
      progressCurrent={step}
      progressTotal={5}
      title="모험을 이어가 볼까요?"
      subTitle={currentStory}
      imageSrc={null}  // BaseScreenLayout 배경 비활성화
    >
      <Content>
        <ImageWrapper image={storyData.image}>
          <ChoicesOverlay>
            {(choices.length > 0 ? choices : ['다음']).map((opt, idx) => (
              <TransparentButton
                key={idx}
                onClick={() => handleChoice(opt)}
              >
                {opt}
              </TransparentButton>
            ))}
          </ChoicesOverlay>
        </ImageWrapper>
      </Content>
    </BaseScreenLayout>
  );
}