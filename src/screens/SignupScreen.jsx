import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../recoil/atoms';

const SignupContainer = styled.div`
  height: 100vh;
  background-color: #001840; /* Figma 배경색 */
  display: flex;
  padding: 6.25rem 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FrameWrapper = styled.div``;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
  gap: 2.5rem;
`;

const FieldGroup = styled.div`
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
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

const SmallCheckButton = styled.button`
  display: flex;
  padding: 0.25rem 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 6.25rem;
  border: 1px solid rgba(253, 252, 250, 0.50);
  background: rgba(253, 252, 250, 0.20);
  color: white;
    cursor: pointer;
    white-space: nowrap;
    &:hover {
      opacity: 0.9;
    }
`;

const SignupButton = styled.button`
  display: flex;
  padding: 0.5rem 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 6.25rem;
  background: #FFC642;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.03rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Message = styled.p`
  color: ${(props) => (props.available ? '#6fff8c' : '#ee5555')};
  text-align: center;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.02rem;
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 1rem;
  color: #fff;
  margin-top: 1rem;
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  const [isIdAvailable, setIsIdAvailable] = useState(null);

  const handleCheckId = () => {
    if (!userID.trim()) return;
    // 간단한 시뮬레이션: userID가 'taken'이면 중복, 그 외엔 사용 가능.
    if (userID.trim() === 'taken') {
      setIsIdAvailable(false);
    } else {
      setIsIdAvailable(true);
    }
  };

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
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (isIdAvailable === false || isIdAvailable === null) {
      alert('사용 가능한 아이디인지 확인해주세요.');
      return;
    }

    // 회원가입 성공 시 Recoil 상태 업데이트 (예시)
    setUserInfo([{ id: userID, password, nickname: userName, pNumber: phoneNum }]);
    navigate('/login');
  };

  return (
    <SignupContainer>
      <FrameWrapper>
        <TitleWrapper>
          <Title>꿈도깨비</Title>
          <SubTitle>나만의 이야기를 만들어봐요!</SubTitle>
        </TitleWrapper>

        <FormWrapper>
          <FieldGroup>
            {/* 아이디 필드 */}
            <FieldWrapper>
              <Label htmlFor="userID">
                아이디
                <SmallCheckButton onClick={handleCheckId}>중복 확인</SmallCheckButton>
              </Label>
              <Input
                id="userID"
                type="text"
                placeholder="아이디"
                value={userID}
                onChange={(e) => {
                  setUserID(e.target.value);
                  setIsIdAvailable(null);
                }}
              />
              {isIdAvailable !== null && (
                <Message available={isIdAvailable}>
                  {isIdAvailable ? '사용 가능한 아이디입니다' : '이미 사용 중인 아이디입니다'}
                </Message>
              )}
            </FieldWrapper>

            {/* 비밀번호 필드 */}
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

            {/* 비밀번호 확인 필드 */}
            <FieldWrapper>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <Message available={password === confirmPassword}>
                  {password === confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                </Message>
              )}
            </FieldWrapper>

            {/* 이름 필드 */}
            <FieldWrapper>
              <Label htmlFor="userName">이름</Label>
              <Input
                id="userName"
                type="text"
                placeholder="이름"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FieldWrapper>

            {/* 전화번호 필드 */}
            <FieldWrapper>
              <Label htmlFor="phoneNum">전화번호</Label>
              <Input
                id="phoneNum"
                type="text"
                placeholder="전화번호"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
              />
            </FieldWrapper>
          </FieldGroup>
          {/* 회원가입 버튼은 FieldGroup 밖에 위치 */}
          <SignupButton onClick={handleSignup}>회원가입</SignupButton>
        </FormWrapper>

        <BottomText>
          이미 계정이 있으신가요?
          <LinkText onClick={() => navigate('/login')}>로그인</LinkText>
        </BottomText>
      </FrameWrapper>
    </SignupContainer>
  );
}