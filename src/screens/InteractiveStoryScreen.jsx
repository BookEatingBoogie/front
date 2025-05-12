import React, { useState } from 'react';
import { useRecoilState } from 'recoil';                                   // Recoil 상태 관리용 hook import
import { storyCreationState } from '../recoil/atoms';                      // 스토리 생성 상태 atom import
import { useNavigate } from 'react-router-dom';                            // 페이지 이동용 hook import
import BaseScreenLayout from '../components/BaseScreenLayout';             // 레이아웃 컴포넌트 import
import styled, { keyframes, createGlobalStyle } from 'styled-components';  // styled-components 및 keyframes, createGlobalStyle import
import squirrelImg from '../assets/images/서영이와 다람쥐.webp';             // 더미 이미지 import
import { postStoryNext } from '../api/story';

// 1) 전역 스타일: --angle 커스텀 프로퍼티 정의
const GlobalStyles = createGlobalStyle`
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
`;

// 2) spin keyframes: --angle 값을 0deg → 360deg로 변경
const spin = keyframes`
  from { --angle: 0deg; }
  to   { --angle: 360deg; }
`;

// 3) 화면 전체 컨테이너
const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// 4) 스토리 이미지 래퍼 (정사각형 비율 유지, 반경, 그림자 포함)
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
    padding-top: 100%; /* 1:1 비율 */
  }
`;

// 5) 선택지 오버레이 (화면 하단 중앙)
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

// 6) 기본 투명 버튼 스타일 (클릭 전)
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
  position: relative; /* ::after/::before 위치 기준 */
  z-index: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

// 7) 선택 시 반짝이는 빛나는 테두리 버튼 스타일
const GlowButton = styled(TransparentButton)`
  /* ::before: 블러 & 반투명 효과 / ::after: 선명한 그라디언트 */
  &::before, &::after {
    content: '';
    position: absolute;
    top: -3px; left: -3px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    border-radius: 0.5rem;
    background-image: conic-gradient(from var(--angle), #FFC642,rgb(241, 225, 188), #FFC642,rgb(244, 226, 186), #FFC642);
    animation: ${spin} 3s linear infinite;
    z-index: -1;
  }
  &::before {
    filter: blur(1.5rem);
    opacity: 0.5;
  }
`;

// 8) 선택 애니메이션 유지 시간 (밀리초 단위)
const GLOW_DURATION = 1000; // 1초 후에 handleChoice 실행

export default function InteractiveStoryScreen() {
  const navigate = useNavigate();                                      // 페이지 이동 함수
  const [storyData, setStoryData] = useRecoilState(storyCreationState); // 스토리 상태
  const { history = [], choices = [], step, question, story} = storyData;

  // 9) 애니메이션 중인 버튼 인덱스 관리
  const [animatingIndex, setAnimatingIndex] = useState(null);
  
  // 개발 중에는 true, 실제 붙일 땐 false
  const useDummy = true;

  const handleOptionClick = (opt, idx) => {
    setAnimatingIndex(idx);

    setTimeout(() => {
      setAnimatingIndex(null);

      if (useDummy) {
        // ← 더미 데이터 업데이트 분기
        setStoryData(prev => {
          const newStep = prev.step + 1;
          return {
            ...prev,
            history: [...prev.history, `선택: ${opt}`],
            story:   `다음 이야기: ${opt} 이후의 내용입니다.`,
            question:`${opt}을 선택했군요. 무엇을 할까요?`,
            image:   squirrelImg,
            choices: ['A', 'B', 'C'],
            step:    newStep,
          };
        });
        if (step >= 5) navigate('/reading');
      } else {
        // ← 실제 백엔드 호출 분기
        postStoryNext({ choice: opt })
          .then(({ data }) => {
            setStoryData(prev => {
              const newStep = prev.step + 1;
              if (newStep > 5) navigate('/reading');
              return {
                ...prev,
                history: [...prev.history, data.story],
                story:    data.story,
                question: data.question,
                image:    data.imgUrl,
                choices:  data.choices,
                step:     newStep,
              };
            });
          })
          .catch(err => {
            console.error(err);
            alert('다음 스토리 생성에 실패했습니다.');
          });
      }
    }, GLOW_DURATION);
  };

  // 13) 현재 스토리 텍스트
  const currentStory = question;

  return (
    <>
      <GlobalStyles /> {/* @property 정의 적용 */}
      <BaseScreenLayout
        progressText={`${step} / 5`}
        progressCurrent={step}
        progressTotal={5}
        title={currentStory}
        subTitle={story}
        imageSrc={null}
      >
        <Content>
          <ImageWrapper image={storyData.image}>
            <ChoicesOverlay>
              {(choices.length > 0 ? choices : ['다음']).map((opt, idx) =>
                animatingIndex === idx
                  ? (
                    // 애니메이션 중에는 GlowButton 렌더링
                    <GlowButton key={idx}>
                      {opt}
                    </GlowButton>
                  )
                  : (
                    // 클릭 전 기본 버튼
                    <TransparentButton
                      key={idx}
                      onClick={() => handleOptionClick(opt, idx)}
                    >
                      {opt}
                    </TransparentButton>
                  )
              )}
            </ChoicesOverlay>
          </ImageWrapper>
        </Content>
      </BaseScreenLayout>
    </>
  );
}