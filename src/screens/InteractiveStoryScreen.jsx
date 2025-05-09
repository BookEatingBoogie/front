import React, { useEffect, useState } from 'react';                       // React 훅 import
import { useRecoilState } from 'recoil';                                   // Recoil 상태 관리용 hook import
import { storyCreationState } from '../recoil/atoms';                      // 스토리 생성 상태 atom import
import { useNavigate } from 'react-router-dom';                            // 페이지 이동용 hook import
import BaseScreenLayout from '../components/BaseScreenLayout';             // 레이아웃 컴포넌트 import
import styled, { keyframes, createGlobalStyle } from 'styled-components';  // styled-components 및 keyframes, createGlobalStyle import
import squirrelImg from '../assets/images/서영이와 다람쥐.webp';             // 더미 이미지 import

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
  const { history = [], choices = [], step = 0, charID, genre, place } = storyData;

  // 9) 애니메이션 중인 버튼 인덱스 관리
  const [animatingIndex, setAnimatingIndex] = useState(null);

  // 10) 최초 API 호출 (백엔드 연결 시 주석 해제)
  useEffect(() => {
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

  // 11) 실제 스토리 진행 함수 (애니메이션 후 호출)
  const handleChoice = (choice) => {
    /*
    // 백엔드 연결 시 주석 해제 ↓
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

    // 마지막 스텝 이후 리딩 화면으로 이동
    if (step >= 5) {
      navigate('/reading');
    }
  };

  // 12) 버튼 클릭 시 애니메이션 트리거 + 지연 후 handleChoice 호출
  const handleOptionClick = (opt, idx) => {
    setAnimatingIndex(idx);                              // 해당 인덱스에 GlowButton 렌더링
    setTimeout(() => {
      setAnimatingIndex(null);                           // 애니메이션 상태 초기화
      handleChoice(opt);                                 // 스토리 진행 함수 호출
    }, GLOW_DURATION);
  };

  // 13) 현재 스토리 텍스트
  const currentStory = history.length
    ? history[history.length - 1]
    : '스토리가 준비되는 중입니다...';

  return (
    <>
      <GlobalStyles /> {/* @property 정의 적용 */}
      <BaseScreenLayout
        progressText={`${step} / 5`}
        progressCurrent={step}
        progressTotal={5}
        title="모험을 이어가 볼까요?"
        subTitle={currentStory}
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