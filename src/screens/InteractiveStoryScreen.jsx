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

// 3) 화면 전체 컨테이너: 이미지와 버튼을 세로로 정렬하고 중앙에 배치
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;           /* 이미지와 버튼 사이 간격 */
  padding-bottom: 2rem; /* 아래 여백 */
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

// 5) 선택지 오버레이: 이미지 아래, 가로로 버튼 나열
const ChoicesOverlay = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  justify-content: center;
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
  const { choices = [], step, question, story, image } = storyData;
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const audioRef = useRef(null);
  const useDummy = true;

  // question, story 바뀔 때마다 순차 재생 (TTS)
useEffect(() => {
  if (!question && !story) return;
  let isCancelled = false;

  // 문장 단위 분할 함수: ., !, ? 뒤로 자르되, 매칭 안 되면 전체를 하나의 청크로
  const splitText = (text) =>
    text
      ? text.match(/[^\.!\?]+[\.!\?]+/g)?.map(s => s.trim()) || [text]
      : [];

  // TTS API 호출 → Blob URL 반환
  const ttsFetch = (chunk) =>
    fetch('http://localhost:5001/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chunk }),
    })
      .then(res => {
        if (!res.ok) throw new Error('TTS 요청 실패');
        return res.blob();
      })
      .then(blob => URL.createObjectURL(blob));

  // 청크 배열을 받아 순차 재생하되, 현재 청크 재생 중에 다음 청크를 미리 요청
  const playChunks = async (chunks) => {
    let preFetchedUrl = null;

    for (let i = 0; i < chunks.length; i++) {
      if (isCancelled) break;

      // 현재 URL: 첫 청크는 await 호출, 이후엔 prefetch 결과 사용
      let url = i === 0
        ? await ttsFetch(chunks[i])
        : preFetchedUrl;

      // 다음 청크가 있으면 즉시 fetch 시작 (prefetch)
      let nextPromise = null;
      if (i + 1 < chunks.length) {
        nextPromise = ttsFetch(chunks[i + 1]);
      }

      // 현재 청크 재생
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();

      // 재생이 끝날 때까지 대기
      await new Promise(resolve => {
        audio.addEventListener('ended', resolve);
      });

      // 사용한 URL 해제
      URL.revokeObjectURL(url);

      // prefetch 결과를 다음 반복에 사용
      if (nextPromise) {
        preFetchedUrl = await nextPromise;
      }
    }
  };

  (async () => {
    const qChunks = splitText(question);
    const sChunks = splitText(story);

    if (qChunks.length) {
      await playChunks(qChunks);
    }
    if (!isCancelled && sChunks.length) {
      await playChunks(sChunks);
    }
  })();

  return () => {
    isCancelled = true;
    if (audioRef.current) {
      audioRef.current.pause();
    }
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
          {/* 1) 이미지 */}
          <ImageWrapper image={image} />

          {/* 2) 그림 바깥, 바로 아래에 버튼 */}
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
        </Content>
      </BaseScreenLayout>
    </>
  );
}