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

  // 파일 선택 완료 -> 선택된 파일을 지정된 엔드포인트로 전송
  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      // FormData에 파일 추가 (파일명은 "child.jpeg"로 강제 지정)
      const formData = new FormData();
      formData.append('image', file, 'test.jpeg');

      // 지정된 엔드포인트로 파일 전송 (POST 요청, no-cors 모드 적용)
      await fetch('https://queries-automatically-neck-been.trycloudflare.com/upload/image?filename=test.jpeg', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      
      // no-cors 모드에서는 응답이 opaque하기 때문에 업로드 성공 여부를 직접 확인할 수 없음
      // 업로드가 정상적으로 진행되었다고 가정하고, S3에 저장될 파일 URL(혹은 해당 서버의 파일 URL)을 지정합니다.
      const imageUrl = 'https://queries-automatically-neck-been.trycloudflare.com/test.jpeg';
      console.log('업로드 성공, 이미지 URL:', imageUrl);

      // characterInfoState의 첫 번째 캐릭터 정보 업데이트 (이미지 URL 반영)
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
    } catch (error) {
      console.error('파일 업로드 중 오류:', error);
    }
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