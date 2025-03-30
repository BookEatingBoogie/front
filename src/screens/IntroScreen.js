import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// 도깨비 전/후
import mainCharacter from '../assets/images/mainCharactor.png';
import mainCharacterBefore from '../assets/images/mainCharactor_before.png';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Title = styled.h1`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #fff;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  position: relative;
  top: 130px; /* Title보다 40px 아래 */
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  width: 80%; /* 폭 제한 */
  max-width: 400px;
`;

const DokkaebiWrapper = styled.div`
  position: absolute;
  bottom: 100px;
  width: 360px; /* 원하는 최대 크기 */
  max-width: 80%; /* 화면 작으면 축소 */
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
`;

const DokkaebiImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: opacity 1s ease;
`;

const HammerHotspot = styled.div`
  position: absolute;
  left: 65%;
  top: 50%;
  width: 22%;
  height: 40%;
  background-color: relative;
  cursor: pointer;
`;

const IntroScreen = () => {
  const navigate = useNavigate();
  const [isHammered, setIsHammered] = useState(false);

  const handleHammerClick = () => {
    setIsHammered(true);
    navigate('character-select');
  };

  return (
    <Container>
      <Title>{"직접 이야기를\n만들어 봐요!"}</Title>
      <SubTitle>이야기를 만들려면 도깨비의 방망이를 두드려 보세요!</SubTitle>
      <DokkaebiWrapper>
        <DokkaebiImage
          src={isHammered ? mainCharacter : mainCharacterBefore}
          alt="도깨비"
        />
        <HammerHotspot onClick={handleHammerClick} />
      </DokkaebiWrapper>
    </Container>
  );
};

export default IntroScreen;