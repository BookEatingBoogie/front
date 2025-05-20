import React from 'react';
import { useRecoilValue } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import styled from 'styled-components';

// 반응형 이미지 컴포넌트
const CharacterImage = styled.img`
  width: 80%;
  max-width: 10rem;      /* 기본 최대 160px */
  height: auto;
  border-radius: 50%;
  margin-bottom: 1.25rem;

  @media (min-width: 360px) {
    max-width: 14rem;    /* 160px */
  }
  @media (min-width: 720px) {
    max-width: 14.2rem; /* 220px */
  }
  @media (min-width: 1080px) {
    max-width: 14.4rem;  /* 280px */
  }
  @media (min-width: 1440px) {
    max-width: 14.6rem;  /* 360px */
  }
`;

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
        <CharacterImage
          src={characterImg}
          alt={characterName}
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