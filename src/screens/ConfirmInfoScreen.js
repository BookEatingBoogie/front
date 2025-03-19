import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import MicSpeakButton from '../components/MicSpeakButton';
import CharacterCard from '../components/CharacterCard';

const ConfirmInfoScreen = () => {
  const userInfo = useRecoilValue(userInfoState);
  const { name, age, gender, job, trait } = userInfo;
  const [questionIndex, setQuestionIndex] = useState(0);

  // "녹음 중" 상태
  const [isRecording, setIsRecording] = useState(false);
  // STT 결과(추가 수정사항) 저장
  const [transcript, setTranscript] = useState('');

  // "기록 완료" -> 녹음 모드 해제, 정보 카드 표시
  const handleComplete = () => {
    setIsRecording(false);
    setTranscript('');
    setQuestionIndex((prev) => prev + 1);
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
            <MicSpeakButton key={questionIndex} onClick={handleComplete} />
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
    </BaseScreenLayout>
  );
};

export default ConfirmInfoScreen;