import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { storyCreationState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import squirrelImg from '../assets/images/서영이와 다람쥐.webp';
import { postStoryNext } from '../api/story';
import { toast } from 'react-toastify';

// 전역 스타일 정의
const GlobalStyles = createGlobalStyle`
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
`;

const spin = keyframes`
  from { --angle: 0deg; }
  to   { --angle: 360deg; }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-bottom: 2rem;
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
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  justify-content: center;
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
  position: relative;
  z-index: 0;
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

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

const GLOW_DURATION = 1000;

export default function InteractiveStoryScreen() {
  useEffect(() => {
    toast.info('컴포넌트 마운트 테스트 알림');
  }, []);

  const navigate = useNavigate();
  const [storyData, setStoryData] = useRecoilState(storyCreationState);
  const { choices = [], step, question, story, image } = storyData;
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const audioRef = useRef(null);
  const useDummy = true;

  // 👉 TTS 관련 코드 주석 처리
  /*
  useEffect(() => {
    if (!question && !story) return;
    let isCancelled = false;

    const splitText = (text) =>
      text
        ? text.match(/[^\.!\?]+[\.!\?]+/g)?.map(s => s.trim()) || [text]
        : [];

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

    const playChunks = async (chunks) => {
      let preFetchedUrl = null;

      for (let i = 0; i < chunks.length; i++) {
        if (isCancelled) break;

        let url = i === 0
          ? await ttsFetch(chunks[i])
          : preFetchedUrl;

        let nextPromise = null;
        if (i + 1 < chunks.length) {
          nextPromise = ttsFetch(chunks[i + 1]);
        }

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();

        await new Promise(resolve => {
          audio.addEventListener('ended', resolve);
        });

        URL.revokeObjectURL(url);

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
  */

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
        if (step >= 5) {
          navigate('/making-cover');
        }
      } else {
        const req = postStoryNext({ choice: opt });

        if (step + 1 > 5) {
          navigate('/making-cover');
        }

        req.then(res => {
          const data = res.data;
          if (res.status === 201) {
            toast.success('처리가 완료되었습니다!');
          } else {
            setStoryData(prev => {
              const newStep = prev.step + 1;
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
          }
        }).catch(() => {
          toast.error('다음 스토리 생성에 실패했습니다.');
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
          <ImageWrapper image={image} />
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
