import React, { useState } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie-player';
import { IoMic } from 'react-icons/io5';
import micAnimationData from '../assets/micAnimation.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const Label = styled.div`
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
`;

const Circle = styled.div`
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LottieWrapper = styled.div`
  width: 60px;
  height: 60px;
  transform: scale(2.5);
`;

const MicSpeakButton = ({ label = '눌러서 말하기', onComplete }) => {
  // clickCount: 0 = 초기 흰색 버튼, 1 = 녹음 중(노란 애니메이션)
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    if (clickCount === 0) {
      // 첫 클릭: 노란 애니메이션 표시
      setClickCount(1);
    } else if (clickCount === 1) {
      // 두 번째 클릭: onComplete 호출 (다음 질문) 후 local state 초기화
      if (onComplete) {
        onComplete();
      }
      setClickCount(0);
    }
  };

  return (
    <Container onClick={handleClick}>
      {clickCount === 0 ? (
        <>
          <Label>{label}</Label>
          <Circle>
            <IoMic size={24} color="#000" />
          </Circle>
        </>
      ) : (
        <>
          <Label>녹음 중...</Label>
          <LottieWrapper>
            <Lottie
              loop
              animationData={micAnimationData}
              play
              style={{ width: '100%', height: '100%' }}
            />
          </LottieWrapper>
        </>
      )}
    </Container>
  );
};

export default MicSpeakButton;