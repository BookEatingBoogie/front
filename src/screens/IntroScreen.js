import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import introAnimation from '../assets/introAnimation1.json'; // Lottie JSON 파일

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Title = styled.h1`
  position: absolute;
  top: 3.75rem;          /* 60px → 3.75rem */
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;     /* 24px → 1.5rem */
  color: #fff;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  position: relative;
  top: 8.125rem;         /* 130px → 8.125rem */
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;   /* 14px → 0.875rem */
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  width: 80%;
  max-width: 25rem;      /* 400px → 25rem */
`;

const DokkaebiWrapper = styled.div`
  position: absolute;
  bottom: 6.25rem;       /* 100px → 6.25rem */
  width: 22.5rem;        /* 360px → 22.5rem */
  max-width: 80%;
  left: 50%;
  transform: translateX(-50%);
`;

const HammerHotspot = styled.div`
  position: absolute;
  left: 65%;
  top: 50%;
  width: 22%;
  height: 40%;
  cursor: pointer;
`;

export default function IntroScreen() {
  const navigate = useNavigate();
  const lottieRef = useRef(null);
  const [play, setPlay] = useState(false);

  // 마운트 시 첫 프레임(0)으로 정지
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.pause();
      lottieRef.current.goToAndStop(0, true);
    }
  }, []);

  // play가 true로 바뀌면 애니메이션 재생 후 페이지 이동
  useEffect(() => {
    if (play && lottieRef.current) {
      lottieRef.current.play();
      const timer = setTimeout(() => {
        navigate('character-select');
      }, 800); // JSON 애니메이션 길이에 맞춰 조정
      return () => clearTimeout(timer);
    }
  }, [play, navigate]);

  return (
    <Container>
      <Title>{"직접 이야기를\n만들어 봐요!"}</Title>
      <SubTitle>이야기를 만들려면 도깨비의 방망이를 두드려 보세요!</SubTitle>

      <DokkaebiWrapper>
        <Lottie
          ref={lottieRef}
          animationData={introAnimation}
          loop={false}
          play={play}
          style={{ width: '100%', height: 'auto' }}
        />
        <HammerHotspot onClick={() => !play && setPlay(true)} />
      </DokkaebiWrapper>
    </Container>
  );
}