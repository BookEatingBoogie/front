import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import MicSpeakButton from '../components/MicSpeakButton';
import CharacterCard from '../components/CharacterCard';

const ConfirmInfoScreen = () => {
  const userInfo = useRecoilValue(userInfoState);
  const { name, age, gender, job, trait } = userInfo;

  // "녹음 중" 상태
  const [isRecording, setIsRecording] = useState(false);
  // STT 결과(추가 수정사항) 저장
  const [transcript, setTranscript] = useState('');

  // "눌러서 말하기" 클릭 -> 녹음 모드
  const handleMicClick = () => {
    setIsRecording(true);
    // 실제 STT 시작 로직 or just UI
  };

  // "기록 완료" -> 녹음 모드 해제, 정보 카드 표시
  const handleComplete = () => {
    setIsRecording(false);
    setTranscript('');
  };

  return (
    <BaseScreenLayout
      progressText="1/6"
      title="정말 멋진 인물이네요!"
      subTitle="당신의 설명을 우리가 제대로 이해 했는지 확인해 주세요.
                이대로 진행한다면 아래 캐릭터 카드를 클릭해 주시고.
                만약 다시 입력하고 싶다면 다시 말해 주세요."
      imageSrc={null}
    >

      {/* 녹음 전 상태 => 캐릭터 카드 + "눌러서 말하기" 버튼 */}
      {!isRecording && (
        <>
          {/* 마이크 버튼 */}
          <div style={{ marginBottom: '20px' }}>
            <MicSpeakButton label="눌러서 말하기" onClick={handleMicClick} />
          </div>

          {/* 캐릭터 정보 카드 */}
          <CharacterCard
            name={name || '이름은10글자이내로'}
            age={age || '20세'}
            gender={gender || '남성'}
            job={job || '개백수'}
            trait={trait || '아침에일어나서 저녁에잠'}
          />
        </>
      )}

      {/* 녹음 중 => 노란 안내문 + STT 박스 + "기록 완료" 버튼 */}
      {isRecording && (
        <>
          <div style={{ color: '#ffcc00', marginBottom: '10px' }}>
            주인공에 대해 입력 중...
          </div>

          {/* STT 박스 */}
          <div
            style={{
              minHeight: '120px',
              border: '2px solid #ccc',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '10px',
              textAlign: 'left',
              fontSize: '16px',
              marginBottom: '20px',
            }}
          >
            {transcript || '말하면 여기에 표시됩니다.'}
          </div>

          {/* 기록 완료 버튼 */}
          <button
            onClick={handleComplete}
            style={{
              padding: '12px 20px',
              borderRadius: '30px',
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              border: '2px solid #fff',
              width: '100%',
            }}
          >
            기록 완료
          </button>
        </>
      )}
    </BaseScreenLayout>
  );
};

export default ConfirmInfoScreen;