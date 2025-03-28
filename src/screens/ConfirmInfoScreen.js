import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import MicSpeakButton from '../components/MicSpeakButton';
import CharacterCard from '../components/CharacterCard';

const ConfirmInfoScreen = () => {
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);
  const character = characterInfo[0] || {};
  const { name, age, gender, job, speciality } = character;

  // 로컬 STT/녹음 관련 상태(백엔드와 연동할 때 사용)
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // "다시 말하기" 버튼 클릭 후 handleComplete 실행 시,
  // 2초 후에 백엔드에서 재구성된 새로운 캐릭터 정보를 받아온다고 가정하여,
  // Recoil 상태를 함수형 업데이트로 변경
  const handleComplete = () => {
    // 녹음 상태와 transcript를 초기화
    setIsRecording(false);
    setTranscript('');
    
    // 시뮬레이션: 2초 후에 백엔드로부터 재구성된 캐릭터 정보를 받았다고 가정
    setTimeout(() => {
      const newCharacter = {
        id: '2',
        name: '새로운 캐릭터',
        age: '6',
        gender: '여성',
        job: '마법사',
        speciality: '마법을 잘 써',
      };
      // 최신 상태(prev)를 기반으로 첫 번째 캐릭터 정보를 새로운 데이터로 업데이트
      setCharacterInfo(prev => [newCharacter, ...prev.slice(1)]);
    }, 2000);
  };

  return (
    <BaseScreenLayout
      progressText="6/6"
      progressCurrent={6}
      progressTotal={6}
      title="정말 멋진 인물이네요!"
      subTitle={
        "당신의 설명을 우리가 제대로 이해했는지 확인해 주세요.\n" +
        "이대로 진행한다면 아래 캐릭터 카드를 클릭해 주세요.\n" +
        "만약 다시 입력하고 싶다면 '다시 말하기' 버튼을 눌러주세요."
      }
      imageSrc={null}
    >
      {/* 녹음 전 상태: 마이크 버튼 + 캐릭터 카드 */}
      {!isRecording && (
        <>
          <div style={{ marginBottom: '20px' }}>
            {/* MicSpeakButton은 key를 주지 않아도 되고, onComplete를 handleComplete로 연결 */}
            <MicSpeakButton onComplete={handleComplete} />
          </div>

          <CharacterCard
            name={name || '이름은10글자이내로'}
            age={age || '20세'}
            gender={gender || '남성'}
            job={job || '직업 없음'}
            speciality={speciality || '특징 없음'}
          />
        </>
      )}

      {/* (필요하다면) 녹음 중 상태 UI를 추가할 수 있습니다. */}
    </BaseScreenLayout>
  );
};

export default ConfirmInfoScreen;