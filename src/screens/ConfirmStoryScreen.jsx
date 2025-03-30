import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { messageState } from '../recoil/atoms';
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
  const messages = useRecoilValue(messageState);

  // 사용자 메시지(대화 기록) 중 speaker가 'user'인 메시지들을 결합하여 초기 요약 텍스트로 사용
  const userMessages = messages.filter(msg => msg.speaker === 'user');
  const initialSummary = userMessages.length > 0
    ? userMessages.map(msg => msg.message).join('\n')
    : '아직 이야기가 없습니다.';

  // 편집 모드 상태와 요약 텍스트 상태
  const [editMode, setEditMode] = useState(false);
  const [summaryText, setSummaryText] = useState(initialSummary);

  // 상단의 "편집하기" 버튼 클릭 시 편집 모드 활성화
  const handleToggleEdit = () => {
    setEditMode(true);
  };

  // 편집 완료 버튼을 누르면 편집 모드를 해제하고, 수정된 내용 저장
  const handleFinishEdit = () => {
    setEditMode(false);
    console.log("편집 완료, 저장된 내용:", summaryText);
    // 필요 시 여기서 백엔드에 수정된 내용을 전송하는 API 호출을 추가할 수 있습니다.
  };

  // 하단 버튼: 편집 모드인 경우 "편집 완료", 그렇지 않으면 "이야기 생성하러 가기"
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
      {/* 편집하기 버튼 (상단 우측, 작게) */}
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

      {/* 이야기 요약 박스 */}
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

      {/* 하단 버튼: 편집 모드이면 "편집 완료", 아니면 "이야기 생성하러 가기" */}
      <RoundedButton
        onClick={handleButtonClick}
      >
        {editMode ? '편집 완료' : '이야기 생성하러 가기'}
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default ConfirmStoryScreen;