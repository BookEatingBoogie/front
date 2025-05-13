import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';                                   // Recoil 상태 관리용 hook import
import { storyCreationState } from '../recoil/atoms';                      // 스토리 생성 상태 atom import
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

// 4) 스토리 이미지 래퍼
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

// 5) 선택지 오버레이
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

// 6) 기본 투명 버튼 스타일
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
  position: relative;
  z-index: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

// 7) 선택 시 반짝이는 빛나는 테두리 버튼 스타일
const GlowButton = styled(TransparentButton)`
  &::before, &::after {
    content: '';
    position: absolute;
    top: -3px; left: -3px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    border-radius: 0.5rem;
    background-image: conic-gradient(from var(--angle), #FFC642, #f1e1bc, #FFC642);
    animation: ${spin} 3s linear infinite;
    z-index: -1;
  }
  &::before {
    filter: blur(1.5rem);
    opacity: 0.5;
  }
`;

// 8) 선택 애니메이션 유지 시간
const GLOW_DURATION = 1000;

export default function InteractiveStoryScreen() {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useRecoilState(storyCreationState);
  const { choices = [], step, question, story } = storyData;

  const [animatingIndex, setAnimatingIndex] = useState(null);
  const audioRef = useRef(null);

  const useDummy = true;

  // question, story 바뀔 때마다 순차 재생
  useEffect(() => {
    if (!question && !story) return;

    let qUrl = null;
    let sUrl = null;
    let isCancelled = false;

    const playSequence = async () => {
      try {
        // 질문 TTS
        const resQ = await fetch('http://localhost:5001/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: question }),
        });
        if (!resQ.ok) throw new Error('질문 TTS 실패');
        const blobQ = await resQ.blob();
        qUrl = URL.createObjectURL(blobQ);

        // 스토리 TTS
        const resS = await fetch('http://localhost:5001/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: story }),
        });
        if (!resS.ok) throw new Error('스토리 TTS 실패');
        const blobS = await resS.blob();
        sUrl = URL.createObjectURL(blobS);

        if (isCancelled) return;

        const audio = new Audio(qUrl);
        audioRef.current = audio;
        audio.play();

        audio.addEventListener('ended', () => {
          if (isCancelled) return;
          const nextAudio = new Audio(sUrl);
          audioRef.current = nextAudio;
          nextAudio.play();
        });
      } catch (err) {
        console.error('TTS 에러:', err);
      }
    };

    playSequence();

    return () => {
      isCancelled = true;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (qUrl) URL.revokeObjectURL(qUrl);
      if (sUrl) URL.revokeObjectURL(sUrl);
    };
  }, [question, story]);

  const handleOptionClick = (opt, idx) => {
    setAnimatingIndex(idx);
    setTimeout(() => {
      setAnimatingIndex(null);
      if (useDummy) {
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
        if (step >= 5) navigate('/making-cover');
      } else {
        postStoryNext({ choice: opt })
          .then(({ data }) => {
            setStoryData(prev => {
              const newStep = prev.step + 1;
              if (newStep > 5) navigate('/making-cover');
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
          .catch(() => {
            alert('다음 스토리 생성에 실패했습니다.');
          });
      }
    }, GLOW_DURATION);
  };

  return (
    <>
      <GlobalStyles />
      <BaseScreenLayout
        progressText={`${step} / 5`}
        progressCurrent={step}
        progressTotal={5}
        title={question}
        subTitle={story}
        imageSrc={null}
      >
        <Content>
          <ImageWrapper image={storyData.image}>
            <ChoicesOverlay>
              {(choices.length > 0 ? choices : ['다음']).map((opt, idx) =>
                animatingIndex === idx ? (
                  <GlowButton key={idx}>{opt}</GlowButton>
                ) : (
                  <TransparentButton key={idx} onClick={() => handleOptionClick(opt, idx)}>
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
