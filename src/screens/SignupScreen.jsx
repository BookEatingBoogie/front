import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../recoil/atoms';

const SignupContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #001840; /* Figma 배경색 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FrameWrapper = styled.div`
  width: 90%;
  max-width: 360px;
`;

const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #fff;
  margin: 0 0 0.5rem 0;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #fff;
  margin: 0;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #fff;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const SignupButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ffc642;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  margin-bottom: 16px;

  &:hover {
    opacity: 0.9;
  }
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 14px;
  color: #fff;
`;

const LinkText = styled.span`
  color: #ffc642;
  cursor: pointer;
  margin-left: 4px;
  text-decoration: underline;
`;

export default function SignupScreen() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  const handleSignup = () => {
    if (
      userID.trim() === '' ||
      password.trim() === '' ||
      userName.trim() === '' ||
      phoneNum.trim() === ''
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 회원가입 성공 시 Recoil 상태 업데이트 (예시)
    setUserInfo([{ id: userID, password, nickname: userName, pNumber: phoneNum }]);
    // 회원가입 완료 후 로그인 화면으로 이동
    navigate('/login');
  };

  return (
    <SignupContainer>
      <FrameWrapper>
        <TitleWrapper>
          <Title>꿈도깨비</Title>
          <SubTitle>나만의 이야기를 만들어봐요!</SubTitle>
        </TitleWrapper>

        <Label htmlFor="userID">아이디</Label>
        <Input
          id="userID"
          type="text"
          placeholder="아이디"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />

        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Label htmlFor="userName">이름</Label>
        <Input
          id="userName"
          type="text"
          placeholder="이름"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <Label htmlFor="phoneNum">전화번호</Label>
        <Input
          id="phoneNum"
          type="text"
          placeholder="전화번호"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
        />

        <SignupButton onClick={handleSignup}>회원가입</SignupButton>

        <BottomText>
          이미 계정이 있으신가요?
          <LinkText onClick={() => navigate('/login')}>로그인</LinkText>
        </BottomText>
      </FrameWrapper>
    </SignupContainer>
  );
}