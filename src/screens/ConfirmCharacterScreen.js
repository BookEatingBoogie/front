import React from 'react';
import { useRecoilValue } from 'recoil';
import { characterInfoState, userInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import RoundedButton from '../components/RoundedButton';
import faceImg from '../assets/images/silhouette.png';
import { postCharacter } from '../api/character';

export default function ConfirmCharacterScreen() {
  const navigate = useNavigate();

  // Recoil에서 유저 정보와 캐릭터 정보 가져오기
  const userInfo = useRecoilValue(userInfoState)[0] || {};
  const characterInfo = useRecoilValue(characterInfoState)[0] || {};

  const userID = userInfo.id;            // 로그인 시 저장된 userID
  const characterName = characterInfo.name || '인물이름';
  const characterImg  = characterInfo.img  || faceImg;

  const handleMakeStory = async () => {
    navigate('/story-question');
    /* 백엔드 연결 후 주석 해제
    try {
      // userID 포함한 페이로드 생성
      const payload = {
        userID,
        charName: characterName,
        charImg: characterImg,
      };

      const { data } = await postCharacter(payload);
      if (data.success) {
        navigate('/story-question');
      } else {
        alert(data.message || '캐릭터 정보 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('postCharacter error:', error);
      alert('서버 오류로 캐릭터 정보를 등록하지 못했습니다.');
    }
    */
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
      <img
        src={characterImg}
        alt="인물"
        style={{
          width: '150px',
          height: 'auto',
          borderRadius: '50%',
          marginBottom: '20px',
        }}
      />

      <RoundedButton onClick={handleMakeStory}>
        이야기를 만들래요!
      </RoundedButton>

      <RoundedButton onClick={handleChangeCharacter}>
        다른 인물로 바꿀래요.
      </RoundedButton>
    </BaseScreenLayout>
  );
}