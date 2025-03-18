import React from 'react';
import styled from 'styled-components';
import { IoMic } from 'react-icons/io5';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

/* 위쪽 텍스트 (예: "눌러서 말하기") */
const Label = styled.div`
  color: #fff;     /* 글자색 (배경이 어두우면 흰색이 가독성 좋음) */
  font-size: 14px;
  margin-bottom: 8px;
`;

/* 원형 배경 (흰색) 안에 마이크 아이콘 */
const Circle = styled.div`
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MicSpeakButton = ({ label = '눌러서 말하기', onClick }) => {
  return (
    <Container onClick={onClick}>
      <Label>{label}</Label>
      <Circle>
        <IoMic size={24} color="#000" />
      </Circle>
    </Container>
  );
};

export default MicSpeakButton;