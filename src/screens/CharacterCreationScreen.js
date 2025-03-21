import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { userInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import MicSpeakButton from '../components/MicSpeakButton';
import GallerySelectButton from '../components/GallerySelectButton';

const CharacterCreationScreen = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const characterName = userInfo.name || '인물이름';

  // 파일 업로드용
  const fileInputRef = useRef(null);

  // “갤러리에서 사진찾기” 버튼 -> 파일 인풋 클릭
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 완료 -> 백엔드 요청 or 로컬 미리보기
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // TODO: 미리보기 or 백엔드에 전송 => 생성된 캐릭터 이미지 받기
    // 예시로 recoil에 저장
    setUserInfo((prev) => ({
      ...prev,
      selectedFile: file,
    }));
    // 이후 ConfirmCharacterScreen으로 이동
    navigate('/confirm');
  };

  // “눌러서 말하기” 버튼 -> 추가 음성 입력
  const handleMicClick = () => {
    // STT 로직 (생김새 말하기)
    // 완료 후 confirm으로 이동 or stay on this screen
    navigate('/confirm');
  };

  return (
    <BaseScreenLayout
      progressText='6/6'
      progressCurrent={6}
      progressTotal={6}
      title={`${characterName}은 어떻게 생겼나요?`}
      subTitle={"인물의 사진이 있다면 사진을 업로드 해주세요.\n사진이 없다면 인물의 생김새를 말해주세요."}
      imageSrc={null}
    >
      <div style={{ marginBottom: '20px' }}>
        <MicSpeakButton onComplete={handleMicClick} />
      </div>

      <GallerySelectButton onClick={handleSelectImage} />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </BaseScreenLayout>
  );
};

export default CharacterCreationScreen;