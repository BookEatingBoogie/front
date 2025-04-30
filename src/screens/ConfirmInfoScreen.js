import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import BaseScreenLayout from '../components/BaseScreenLayout';
import CharacterCard from '../components/CharacterCard';

const ConfirmInfoScreen = () => {
  const location = useLocation();
  // CharacterQuestionScreen에서 마지막 호출 시 state.finalCharacter로 전달한 최종 결과를 받습니다.
  const finalResponse = location.state?.finalCharacter;
  const [characterInfo] = useRecoilState(characterInfoState);
  const character = characterInfo[0] || {};
  const { name, age, gender, job, speciality } = character;

  return (
    <BaseScreenLayout
      progressText="최종 확인"
      progressCurrent={6}
      progressTotal={6}
      title="정말 멋진 인물이네요!"
      subTitle="아래 캐릭터 카드를 눌러 다음 단계로 진행하세요."
      imageSrc={null}
    >
      <CharacterCard
        name={name}
        age={age}
        gender={gender}
        job={job}
        speciality={speciality}
        finalResponse={finalResponse}
      />
    </BaseScreenLayout>
  );
};

export default ConfirmInfoScreen;