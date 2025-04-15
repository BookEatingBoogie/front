import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { storyCreationState, characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const EditContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const SummaryContainer = styled.div`
  background-color: #fbf9f4;
  color: #000;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  resize: vertical;
  box-sizing: border-box;
`;

const ConfirmStoryScreen = () => {
  const navigate = useNavigate();
  const storyInfo = useRecoilValue(storyCreationState);
  const characterInfo = useRecoilValue(characterInfoState);
  const character = characterInfo.find(c => c.id === String(storyInfo.charID)) || {};

  // 이야기 요약 구성
  const autoSummary = `
    주인공 이름: ${character.name || '이름 없음'}
    나이: ${character.age || '미정'}, 성별: ${character.gender || '미정'}
    직업: ${character.job || '없음'}, 성격: ${character.speciality || '없음'}

    장르: ${storyInfo.genre || '선택 안됨'}
    장소: ${storyInfo.place || '선택 안됨'}
    분위기: ${storyInfo.mood || '선택 안됨'}
    조력자: ${storyInfo.helper ? '있음' : '없음'}
    방해자: ${storyInfo.villain ? '있음' : '없음'}
  `;

  const [editMode, setEditMode] = useState(false);
  const [summaryText, setSummaryText] = useState(autoSummary.trim());

  const handleToggleEdit = () => setEditMode(true);
  const handleFinishEdit = () => {
    setEditMode(false);
    console.log('최종 요약:', summaryText);
  };

  const handleButtonClick = () => {
    if (editMode) {
      handleFinishEdit();
    } else {
      navigate('/loading');
    }
  };

  return (
    <BaseScreenLayout
      progressText="마지막 단계"
      title="마지막으로 이야기 내용을 확인해주세요!"
      subTitle="수정할 사항이 있다면 아래 내용을 변경해주세요."
      imageSrc={null}
    >
      <EditContainer>
        {!editMode && (
          <RoundedButton
            onClick={handleToggleEdit}
            bgColor="rgba(253, 252, 250, 0.20)"
            fontColor="white"
            borderColor="white"
            style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
          >
            편집하기
          </RoundedButton>
        )}
      </EditContainer>

      <SummaryContainer>
        <h3>이야기 내용</h3>
        {editMode ? (
          <TextArea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
          />
        ) : (
          <p style={{ whiteSpace: 'pre-wrap' }}>{summaryText}</p>
        )}
      </SummaryContainer>

      <RoundedButton onClick={handleButtonClick}>
        {editMode ? '편집 완료' : '이야기 생성하러 가기'}
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default ConfirmStoryScreen;