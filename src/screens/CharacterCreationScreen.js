import React, { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import MicSpeakButton from '../components/MicSpeakButton';
import GallerySelectButton from '../components/GallerySelectButton';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = 'ap-northeast-2';
const BUCKET = 'bookeating';
const S3_BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file) => {
  const key = `character/${Date.now()}_${file.name}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  }));
  return `${S3_BASE_URL}${key}`;
};

const CharacterCreationScreen = () => {
  const navigate = useNavigate();
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);
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
      // FormData에 파일 추가 (파일명은 "hello.jpeg"로 강제 지정)
      const formData = new FormData();
      formData.append('image', file, 'hello.jpeg');

      // 지정된 엔드포인트로 파일 전송 (POST 요청, no-cors 모드 적용)
      await fetch('https://cfr-realistic-follow-recovered.trycloudflare.com/upload/image?filename=hello.jpeg', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      
      // no-cors 모드에서는 응답이 opaque하기 때문에 업로드 성공 여부를 직접 확인할 수 없음
      // 업로드가 정상적으로 진행되었다고 가정하고, S3에 저장될 파일 URL(혹은 해당 서버의 파일 URL)을 지정합니다.
      const imageUrl = 'https://cfr-realistic-follow-recovered.trycloudflare.com/hello.jpeg';
      console.log('업로드 성공, 이미지 URL:', imageUrl);
      const s3Url = await uploadToS3(file);
      console.log('S3 업로드 완료:', s3Url);

      // characterInfoState의 첫 번째 캐릭터 정보 업데이트 (이미지 URL 반영)
      setCharacterInfo(prev => {
        const first = prev[0] || {};
        const updated = { ...first, userImg: s3Url };
        return [updated, ...prev.slice(1)];
      });
      
      navigate('/character-question'); // ConfirmCharacterScreen으로 이동
    } catch (error) {
      console.error('파일 업로드 중 오류:', error);
    }
  };

  // "눌러서 말하기" 버튼 -> 음성 입력 (여기서는 단순히 confirm 화면으로 이동)
  const handleMicClick = () => {
    navigate('/character-question');
  };

  return (
    <BaseScreenLayout
      progressText="1/3"
      progressCurrent={1}
      progressTotal={3}
      title={`주인공은 어떻게 생겼나요?`}
      subTitle={
        "주인공이 될 인물의 사진을 업로드 해주세요."
      }
      imageSrc={null}
    > 
    // 여기주석처리
      <div style={{ marginBottom: '20px' }}>
        <MicSpeakButton onComplete={handleMicClick} />
      </div>
      // 여기주석처리

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