import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import BaseScreenLayout from '../components/BaseScreenLayout';
import { userInfoState } from '../recoil/atoms';
import RoundedButton from '../components/RoundedButton'; // 재활용 가능 버튼 컴포넌트

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  width: 100%;
  max-width: 400px; 
  margin: 0 auto;
`;

const Block = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  color: #fff;
`;

const BlockTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const BlockItem = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

export default function SettingScreen() {
  // Recoil에서 사용자 정보 가져오는 예시
  const userInfo = useRecoilValue(userInfoState);
  const currentUser = userInfo[0] || {
    id: 'sampleId',
    nickname: '홍길동',
    pNumber: '010-0000-0000',
  };

  // 예시 데이터 (실제로는 서버나 Recoil 상태에서 불러옴)
  const creationLogs = [
    { title: '동화 생성', date: '2023-10-05', time: '10:20' },
    { title: '동화 생성', date: '2023-10-06', time: '14:15' },
  ];

  const parentReports = [
    { title: '장르', content: '판타지' },
    { title: '장소', content: '공주성' },
    { title: '관심사', content: '마법' },
    { title: '화법', content: '대화체' },
  ];

  const handleLogout = () => {
    // 로그아웃 로직 (예: 토큰 삭제, 페이지 리다이렉트 등)
    console.log('로그아웃 버튼 클릭');
  };

  const handleDeleteAccount = () => {
    // 회원탈퇴 로직
    console.log('회원탈퇴 버튼 클릭');
  };

  return (
    <BaseScreenLayout
      title="설정"
      subTitle="계정 정보와 생성 기록, 부모 리포트를 확인하세요."
      imageSrc={null}
      progressText=""
      progressCurrent={0}
      progressTotal={0}
    >
      <Container>
        {/* 로그인 정보 블록 */}
        <Block>
          <BlockTitle>로그인 정보</BlockTitle>
          <BlockItem>닉네임: {currentUser.nickname}</BlockItem>
          <BlockItem>아이디(이메일): {currentUser.id}</BlockItem>
          <BlockItem>연락처: {currentUser.pNumber}</BlockItem>
        </Block>

        {/* 생성 정보(생성 로그) 블록 */}
        <Block>
          <BlockTitle>생성 정보</BlockTitle>
          {creationLogs.map((log, idx) => (
            <BlockItem key={idx}>
              {log.title} - {log.date} {log.time}
            </BlockItem>
          ))}
        </Block>

        {/* 부모 리포트 블록 (스크립트, 통계) */}
        <Block>
          <BlockTitle>부모 리포트</BlockTitle>
          {parentReports.map((report, idx) => (
            <BlockItem key={idx}>
              {report.title}: {report.content}
            </BlockItem>
          ))}
        </Block>

        {/* 로그아웃 / 회원탈퇴 버튼 */}
        <ButtonContainer>
          <RoundedButton onClick={handleLogout}>
            로그아웃
          </RoundedButton>
          <RoundedButton
            onClick={handleDeleteAccount}
            bgColor="#ff4d4d"  // 위험 동작이므로 붉은색 계열 예시
            borderColor="#ff4d4d"
          >
            회원탈퇴
          </RoundedButton>
        </ButtonContainer>
      </Container>
    </BaseScreenLayout>
  );
}