import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import faceImg from '../assets/images/silhouette.png'; 

const ConfirmCharacterScreen = () => {
  const navigate = useNavigate();

  const handleMakeStory = () => {
    navigate('/question/story');
  };

  const handleChangeCharacter = () => {
    navigate('/character-select');
  };

  const characterName = "인물이름";

  return (
    <BaseScreenLayout
      progressText="1/6"
      title={`${characterName}은 이렇게 생겼군요!`}
      subTitle="이 인물로 이야기를 만들어볼까요?"
    >
      <div style={{ color: '#fff', marginBottom: '20px' }}>2/6</div>

      <img
        src={faceImg}
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
        bgColor="#fff"
        fontColor="black"
        borderColor="#fff"
      >
        이야기를 만들래요!
      </RoundedButton>

      <RoundedButton
        onClick={handleChangeCharacter}
        bgColor="#fff"
        fontColor="black"
        borderColor="#fff"
      >
        다른 인물로 바꿀래요.
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default ConfirmCharacterScreen;