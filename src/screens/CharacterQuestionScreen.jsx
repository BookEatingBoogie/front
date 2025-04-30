import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { characterInfoState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import BaseScreenLayout from '../components/BaseScreenLayout';
import silhouetteImg from '../assets/images/silhouette.png';
import RoundedButton from '../components/RoundedButton';

const NameQuestionScreen = () => {
  const navigate = useNavigate();
  const [characterInfo, setCharacterInfo] = useRecoilState(characterInfoState);
  const [name, setName] = useState(characterInfo[0]?.name || '');

  const handleNext = () => {
    if (!name.trim()) return;
    setCharacterInfo(prev => {
      const updatedFirst = { ...prev[0], name: name.trim() };
      return [updatedFirst, ...prev.slice(1)];
    });
    navigate('/confirm-character');
  };

  return (
    <BaseScreenLayout
      progressText="2/3"
      progressCurrent={2}
      progressTotal={3}
      title="주인공의 이름이 무엇인가요?"
      subTitle="이름을 입력하고 다음으로 넘어가세요."
      imageSrc={silhouetteImg}
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="이름 입력"
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '20px'
        }}
      />
      <RoundedButton onClick={handleNext}>
        확인
      </RoundedButton>
    </BaseScreenLayout>
  );
};

export default NameQuestionScreen;