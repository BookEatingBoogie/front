import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 기존 static 이미지(방망이 전)
import mainCharacterBefore from '../assets/images/mainCharactor_before.png';
// 새로 추가할 GIF
import hammerGif from '../assets/images/animation_2x.gif';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Title = styled.h1`
  position: absolute;
  top: 3.75rem;          /* 60px → 60/16 = 3.75rem */
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;     /* 24px → 24/16 = 1.5rem */
  color: #fff;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  position: relative;
  top: 8.125rem;         /* 130px → 130/16 = 8.125rem */
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;   /* 14px → 14/16 = 0.875rem */
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  width: 80%;
  max-width: 25rem;      /* 400px → 400/16 = 25rem */
`;

const DokkaebiWrapper = styled.div`
  position: absolute;
  bottom: 6.25rem;       /* 100px → 100/16 = 6.25rem */
  width: 22.5rem;        /* 360px → 360/16 = 22.5rem */
  max-width: 80%;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
`;

const DokkaebiImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
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
  const [playGif, setPlayGif] = useState(false);

  const handleHammerClick = () => {
    if (!playGif) {
      setPlayGif(true);
    }
  };

  useEffect(() => {
    if (playGif) {
      // GIF 전체 길이에 맞춰서 타이머 설정 (예: 800ms)
      const GIF_DURATION_MS = 800;
      const timer = setTimeout(() => {
        navigate('character-select');
      }, GIF_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [playGif, navigate]);

  return (
    <Container>
      <Title>{"직접 이야기를\n만들어 봐요!"}</Title>
      <SubTitle>이야기를 만들려면 도깨비의 방망이를 두드려 보세요!</SubTitle>
      <DokkaebiWrapper>
        <DokkaebiImage
          src={playGif ? hammerGif : mainCharacterBefore}
          alt="도깨비 애니메이션"
        />
        <HammerHotspot onClick={handleHammerClick} />
      </DokkaebiWrapper>
    </Container>
  );
}