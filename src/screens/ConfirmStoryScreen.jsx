import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { storyCreationState, characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  background-color: #fbf9f4;
  color: #000;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const baseURL = 'http://localhost:8080';

const ConfirmStoryScreen = () => {
  const navigate = useNavigate();
  const storyInfo = useRecoilValue(storyCreationState);
  const characterInfo = useRecoilValue(characterInfoState);
  // storyInfo.charID에 해당하는 캐릭터를 찾습니다.
  const character = characterInfo.find(c => c.id === String(storyInfo.charID)) || {};

  // 읽기 전용으로 보여줄 스토리 요약 (필요에 따라 형식을 바꿀 수 있습니다)
  const displaySummary = `
    주인공: ${character.name || '없음'}
    장르: ${storyInfo.genre || '없음'}
    장소: ${storyInfo.place || '없음'}
    분위기: ${storyInfo.mood || '없음'}
    조력자: ${storyInfo.helper ? '있음' : '없음'}
    방해자: ${storyInfo.villain ? '있음' : '없음'}
  `.trim();

  // "이야기 생성하러 가기" 버튼 클릭 시, 백엔드에 스토리 정보를 전송합니다.
  const handleGenerateStory = async () => {
    try {
      const payload = {
        charID: storyInfo.charID,
        genre: storyInfo.genre,
        place: storyInfo.place,
        mood: storyInfo.mood,
        helper: storyInfo.helper,
        villain: storyInfo.villain,
      };
      const response = await fetch(`${baseURL}/gpt/story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('스토리 생성 실패');
      // 백엔드에서 string 형식의 결과를 반환한다고 가정합니다.
      const resultString = await response.text();
      console.log('스토리 생성 결과:', resultString);
      // 결과를 받은 후 /result 화면으로 이동합니다.
      navigate('/result');
    } catch (error) {
      console.error('스토리 전송 오류:', error);
      // 오류 발생 시에도 /result로 이동하거나, 추가 에러 처리를 할 수 있습니다.
      navigate('/result');
    }
  };

  // "편집하기" 버튼 클릭 시, /story-question 페이지로 돌아갑니다.
  const handleEditStory = () => {
    navigate('/story-question');
  };

  return (
    <BaseScreenLayout
      progressText="마지막 단계"
      title="이야기 정보를 확인해주세요!"
      subTitle="수정이 필요하면 편집하기 버튼을, 스토리 생성을 원하면 이야기 생성하러 가기 버튼을 눌러주세요."
      imageSrc={null}
    >
      <SummaryContainer>
        {displaySummary}
      </SummaryContainer>
        
      <RoundedButton onClick={handleGenerateStory}>
        이야기 생성하러 가기
      </RoundedButton>
      <RoundedButton onClick={handleEditStory}>
        편집하기
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default ConfirmStoryScreen;