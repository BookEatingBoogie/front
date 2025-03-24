import React from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import { useNavigate } from 'react-router-dom';

const ConfirmStoryScreen = () => {
  const userInfo = useRecoilValue(userInfoState);

  // 예: userInfo에 storyAnswers(공간적 배경, 시간적 배경, 사건, etc.)가 들어있다고 가정
  const { storyAnswers } = userInfo || {};
  const navigate = useNavigate();
  // "이야기 생성하러 가기" 버튼 클릭 → 예: 최종 story 생성 로직 or 이동
  const handleCreateStory = () => {
    // 로딩 화면으로 이동
    navigate('/loading');
  };

  return (
    <BaseScreenLayout
      progressText="마지막 단계"
      title="마지막으로 확인해주세요."
      subTitle={
        "제가 이야기를 제대로 이해했는지\n" +
        "다시 한 번 읽어봐 주시고,\n" +
        "수정할 사항이 있다면 변경해주세요."
      }
      imageSrc={null}
    >
      {/* 이야기 요약 박스 (예시) */}
      <div
        style={{
          backgroundColor: '#fbf9f4',
          color: '#000',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '20px',
        }}
      >
        <h3>이야기 내용</h3>
        {/* storyAnswers가 배열이면 map, 객체라면 객체 구조에 따라 표시 */}
        {storyAnswers ? (
          <p>{JSON.stringify(storyAnswers)}</p>
        ) : (
          <p>아직 이야기가 없습니다.</p>
        )}
      </div>

      {/* 이야기 생성하기 버튼 */}
      <RoundedButton
        onClick={handleCreateStory}
      >
        이야기를 만들래요!
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default ConfirmStoryScreen;