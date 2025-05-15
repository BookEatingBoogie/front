import React from 'react';
import { useRecoilValue } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';

export default function ConfirmCharacterScreen() {
  const navigate = useNavigate();
  const characterInfo = useRecoilValue(characterInfoState)[0] || {};
  const characterName = characterInfo.name || '인물이름';
  const characterImg  = characterInfo.img  || null;

  const handleMakeStory = () => {
    navigate('/story-question');
  };

  const handleChangeCharacter = () => {
    navigate('/character-select');
  };

  return (
    <BaseScreenLayout
      progressText="3/3"
      progressCurrent={3}
      progressTotal={3}
      title={`${characterName}!\n이렇게 생겼군요!`}
      subTitle="이 인물로 이야기를 만들어볼까요?"
      imageSrc={null}
    >
      {characterImg && (
        <img
          src={characterImg}
          alt={characterName}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '50%',
            marginBottom: '20px',
            left: '50%'
          }}
        />
      )}

      <RoundedButton onClick={handleMakeStory}>
        이야기를 만들래요!
      </RoundedButton>

      <RoundedButton onClick={handleChangeCharacter}>
        다른 인물로 바꿀래요.
      </RoundedButton>
    </BaseScreenLayout>
  );
}