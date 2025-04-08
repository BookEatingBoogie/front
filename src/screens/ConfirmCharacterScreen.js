import React from 'react';
import { useRecoilValue } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import faceImg from '../assets/images/silhouette.png'; 

const ConfirmCharacterScreen = () => {
  const navigate = useNavigate();
  // Recoil atom에서 캐릭터 정보를 가져옵니다. (배열로 관리)
  const characterInfo = useRecoilValue(characterInfoState);
  const character = characterInfo[0] || {};
  const { name, img } = character;
  const characterName = name || '인물이름';

  const handleMakeStory = () => {
    navigate('/story-question');
  };

  const handleChangeCharacter = () => {
    navigate('/character-select');
  };

  return (
    <BaseScreenLayout
      progressText="6/6"
      progressCurrent={6}
      progressTotal={6}
      title={`${characterName}가 이렇게 생겼군요!`}
      subTitle="이 인물로 이야기를 만들어볼까요?"
      imageSrc={null}
    >
      <img
        src={img || faceImg}
        alt="인물"
        style={{
          width: '150px',
          height: 'auto',
          borderRadius: '50%',
          marginBottom: '20px',
        }}
      />

      <RoundedButton
        onClick={handleMakeStory}
      >
        이야기를 만들래요!
      </RoundedButton>

      <RoundedButton
        onClick={handleChangeCharacter}
      >
        다른 인물로 바꿀래요.
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default ConfirmCharacterScreen;