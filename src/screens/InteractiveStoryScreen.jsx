import React, { useEffect, useState } from 'react';                  // React 훅(useEffect, useState) import
import { useRecoilState } from 'recoil';                              // Recoil 상태 관리용 hook import
import { storyCreationState } from '../recoil/atoms';                 // 스토리 생성 상태를 저장하는 atom import
import { useNavigate } from 'react-router-dom';                       // 페이지 이동용 hook import
import BaseScreenLayout from '../components/BaseScreenLayout';        // 공통 레이아웃 컴포넌트 import
import styled from 'styled-components';                               // styled-components import
import squirrelImg from '../assets/images/서영이와 다람쥐.webp';        // 더미 이미지 import

// 백엔드 연결 시 사용: 스토리 시작/진행 API 함수 import (주석 해제 후 사용)
// import { postStoryStart, postStoryNext } from '../api/story';

// Lottie 애니메이션용 라이브러리와 JSON 데이터 import
import Lottie from 'react-lottie-player';
import buttonAnimationData from '../assets/buttonAnimation.json';    // assets 폴더에 위치한 Lottie JSON

// 화면 전체를 감싸는 컨테이너 스타일
const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// 이미지 비율 유지와 그림자, 라운드 처리용 래퍼 스타일
const ImageWrapper = styled.div`
  width: 100%;
  margin: 2rem auto 0;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  /* Lottie 재생 중이 아닐 땐 storyData.image, 없으면 squirrelImg 사용 */
  background-image: ${props => `url("${props.image || squirrelImg}")`};
  background-size: cover;
  background-position: center;
  &::before {
    content: "";
    display: block;
    padding-top: 100%; /* 정사각형 비율 유지 */
  }
`;

// 선택지 버튼을 겹치도록 배치하는 오버레이 스타일
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

// 기본 버튼 스타일 (클릭 전)
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
  const navigate = useNavigate();                                     // 페이지 이동 함수
  const [storyData, setStoryData] = useRecoilState(storyCreationState); // 스토리 상태 가져오기/설정
  const { history = [], choices = [], step = 0, charID, genre, place } = storyData;

  // **애니메이션 중인 버튼 인덱스 관리 state**
  const [animatingIndex, setAnimatingIndex] = useState(null);

  // 컴포넌트 마운트 또는 step, charID, genre, place 변경 시 최초 API 호출 (백엔드 연결 후 주석 해제)
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

  // 선택지를 눌렀을 때(애니메이션 후) 호출되는 스토리 진행 함수
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

    // **더미 데이터 업데이트 (백엔드 연결 후 실제 API 호출로 변경)**
    setStoryData(prev => ({
      ...prev,
      history: [...prev.history, `선택: ${choice}`],
      story: `다음 이야기 (더미): ${choice} 이후의 내용입니다.`,
      image: squirrelImg,
      choices: ['선택지 A', '선택지 B', '선택지 C'],
      step: prev.step + 1,
      selectedChoice: choice,
    }));

    // 마지막 스텝 이후엔 리딩 화면으로 이동
    if (step >= 5) {
      navigate('/reading');
    }
  };

  // 현재 보여줄 스토리 텍스트 결정
  const currentStory = history.length
    ? history[history.length - 1]
    : '스토리가 준비되는 중입니다...';

  return (
    <BaseScreenLayout
      progressText={`${step} / 5`}    // 상단 프로그레스 텍스트
      progressCurrent={step}           // 현재 프로그레스 값
      progressTotal={5}                // 총 프로그레스 값
      title="모험을 이어가 볼까요?"     // 화면 타이틀
      subTitle={currentStory}          // 스토리 텍스트
      imageSrc={null}                  // 배경 이미지 비활성화
    >
      <Content>
        <ImageWrapper image={storyData.image}>
          <ChoicesOverlay>
            {
              // choices가 없으면 ['다음'] 보여줌
              (choices.length > 0 ? choices : ['다음']).map((opt, idx) => (
                animatingIndex === idx
                  // 애니메이션 중일 때 Lottie 컴포넌트 렌더링
                  ? (
                    <Lottie
                      key={`anim-${idx}`}
                      loop={false}                     // 반복 재생하지 않음
                      animationData={buttonAnimationData} // JSON 애니메이션 데이터
                      play                              // 자동 재생
                      style={{ width: '100%', height: '100%' }}  // 크기 지정
                      onComplete={() => {              // 애니메이션 완료 시 호출
                        setAnimatingIndex(null);       // 애니메이션 상태 초기화
                        handleChoice(opt);             // 스토리 진행 함수 호출
                      }}
                    />
                  )
                  // 애니메이션 전 기본 버튼 렌더링
                  : (
                    <TransparentButton
                      key={idx}
                      onClick={() => setAnimatingIndex(idx)} // 클릭 시 애니메이션 시작
                    >
                      {opt}
                    </TransparentButton>
                  )
              ))
            }
          </ChoicesOverlay>
        </ImageWrapper>
      </Content>
    </BaseScreenLayout>
  );
}