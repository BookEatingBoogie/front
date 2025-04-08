import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
// 캐릭터 정보 atom (여기서는 characterInfoState 사용)
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import MicSpeakButton from '../components/MicSpeakButton';
import GallerySelectButton from '../components/GallerySelectButton';

const CharacterCreationScreen = () => {
  const navigate = useNavigate();
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);
  // characterInfo는 배열 형태이므로, 첫 번째 요소를 사용
  const character = characterInfo[0] || {};
  const characterName = character.name || '인물이름';

  // 파일 업로드용 ref
  const fileInputRef = useRef(null);

  // "갤러리에서 사진 찾아오기" 버튼 클릭 -> 파일 인풋 클릭
  const handleSelectImage = () => {
    console.log('갤러리 버튼 클릭: 파일 선택 창 열기');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 완료 -> 선택된 파일의 URL을 생성해서, 캐릭터 정보의 img 업데이트 후 confirm 화면으로 이동
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // 로컬 미리보기를 위한 blob URL 생성 (실제 백엔드 연결 시 API 호출로 대체 가능)
    const imageUrl = URL.createObjectURL(file);
    console.log('생성된 이미지 URL:', imageUrl);

    // characterInfoState의 첫 번째 캐릭터 정보 업데이트 (함수형 업데이트 사용)
    setCharacterInfo(prev => {
      const updated = prev.length > 0
        ? [{ ...prev[0], img: imageUrl }, ...prev.slice(1)]
        : [{
            id: '0',
            name: characterName,
            age: '',
            gender: '',
            job: '',
            speciality: '',
            note: '',
            userImg: imageUrl,
            img: '',
          }];
      console.log('업데이트된 characterInfo:', updated);
      return updated;
    });
    navigate('/confirm'); // ConfirmCharacterScreen으로 이동
  };

  // "눌러서 말하기" 버튼 -> 음성 입력 (여기서는 단순히 confirm 화면으로 이동)
  const handleMicClick = () => {
    navigate('/confirm');
  };

  return (
    <BaseScreenLayout
      progressText="6/6"
      progressCurrent={6}
      progressTotal={6}
      title={`${characterName}은 어떻게 생겼나요?`}
      subTitle={
        "인물의 사진이 있다면 사진을 업로드 해주세요.\n" +
        "사진이 없다면 인물의 생김새를 말해주세요."
      }
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