import React from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  /* 배경 이미지 예시 */
  background: url('https://via.placeholder.com/600x400') no-repeat center/cover;
`;

const ResultScreen = () => {
  const userInfo = useRecoilValue(userInfoState);

  return (
    <Container>
      <h2>결과 화면</h2>
      <p>선택한 아바타: {userInfo.avatar}</p>
      <p>입력한 이름: {userInfo.name}</p>
    </Container>
  );
};

export default ResultScreen;