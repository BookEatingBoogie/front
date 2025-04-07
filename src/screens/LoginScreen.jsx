import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../recoil/atoms';

const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #001840;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6.25rem 2rem 16.875rem 2rem;
  flex-shrink: 0;
`;

const FrameWrapper = styled.div`
  max-width: 25.75rem;
`;

const TitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 6rem;
`;

const Title = styled.h1`
    color: #FDFCFA;
    text-align: center;
    font-family: Pretendard;
    font-size: 3rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.06rem;
`;

const SubTitle = styled.p`
    color: #FDFCFA;
    text-align: center;
    font-family: Pretendard;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.03rem;
`;

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
`;

const CredentialWrapper = styled.div`
  display: flex;
width: 19.875rem;
flex-direction: column;
align-items: flex-start;
gap: 2rem;
`;

const FieldWrapper = styled.div`
  display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 0.5rem;
align-self: stretch;
`;

const Label = styled.label`
color: #FDFCFA;
text-align: center;
font-family: Pretendard;
font-size: 1.5rem;
font-style: normal;
font-weight: 700;
line-height: 2.1875rem; /* 145.833% */
letter-spacing: -0.03rem;
`;

const Input = styled.input`
display: flex;
padding: 1rem;
align-items: center;
align-self: stretch;
border: 1px solid rgba(253, 252, 250, 0.50);
background: rgba(253, 252, 250, 0.20);
color: white;
&::placeholder {
    color: #aaa; /* 원하는 힌트글씨 색상으로 변경 */
  }
`;

const LoginButton = styled.button`
display: flex;
width: 9.125rem;
padding: 0.5rem 2rem;
justify-content: center;
align-items: center;
border-radius: 6.25rem;
background: #FFC642;
color: #1A202B;
text-align: center;
font-family: Pretendard;
font-size: 1.5rem;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: -0.03rem;
  &:hover {
    opacity: 0.9;
  }
`;

const BottomText = styled.div`
color: #FDFCFA;
text-align: center;
font-family: Pretendard;
font-size: 1rem;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: -0.02rem;
`;

const LinkText = styled.span`
  color: #ffc642;
  cursor: pointer;
  margin-left: 0.25rem;
  text-decoration: underline;
`;

export default function LoginScreen() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 간단한 유효성 검사 (백엔드 연동 시 추가)
    if (userID.trim() === '' || password.trim() === '') {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 로그인 성공 시 Recoil 상태 업데이트 (예시)
    setUserInfo([{ id: userID, password, nickname: '사용자', pNumber: '010-0000-0000' }]);
    // 로그인 후 메인 화면 또는 홈으로 이동
    navigate('/');
  };

  return (
    <LoginContainer>
      <FrameWrapper>
        <TitleWrapper>
          <Title>꿈도깨비</Title>
          <SubTitle>나만의 이야기를 만들어봐요!</SubTitle>
        </TitleWrapper>

        <FormWrapper>
          <CredentialWrapper>
            <FieldWrapper>
              <Label htmlFor="userID">아이디</Label>
              <Input
                id="userID"
                type="text"
                placeholder="아이디"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </FieldWrapper>
            <FieldWrapper>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FieldWrapper>
          </CredentialWrapper>

          <LoginButton onClick={handleLogin}>로그인</LoginButton>
        

            <BottomText>
            아직 계정이 없다면?
            <LinkText onClick={() => navigate('/signup')}>회원가입</LinkText>
            </BottomText>
        </FormWrapper>
      </FrameWrapper>
    </LoginContainer>
  );
}