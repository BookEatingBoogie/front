import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
  background-color: #fbf9f4;
  color: #000;
  border: 1px solid #000;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  cursor: pointer; /* 클릭 가능하게 */
  text-align: center;
`;

/* 상단 "캐릭터 카드" 제목 */
const CardTitle = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  font-size: 16px;
  border-bottom: 1px solid #ccc; /* 구분선 */
  padding-bottom: 8px;
`;

/* 각 항목(이름, 나이, 성별 등)을 표시할 텍스트 */
const InfoLine = styled.p`
  margin: 4px 0;
  font-size: 14px;
`;

function CharacterCard({ name, age, gender, job, speciality }) {
  const navigate = useNavigate();

  // 카드 전체를 클릭하면 CharacterCreationScreen으로 이동
  const handleClick = () => {
    navigate('/create-character');
  };

  return (
    <CardContainer onClick={handleClick}>
      <CardTitle>캐릭터 카드</CardTitle>
      <InfoLine>이름: {name}</InfoLine>
      <InfoLine>나이: {age}</InfoLine>
      <InfoLine>성별: {gender}</InfoLine>
      <InfoLine>직업: {job}</InfoLine>
      <InfoLine>성격: {speciality}</InfoLine>
    </CardContainer>
  );
}

export default CharacterCard;