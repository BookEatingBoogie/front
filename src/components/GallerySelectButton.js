import React from 'react';
import styled from 'styled-components';
import { IoImageOutline } from 'react-icons/io5';

const ButtonContainer = styled.div`
  width: 80%;
  background-color: rgb(255, 255, 255, 0.2);
  border: 2px dashed #fff;
  border-radius: 10px;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  padding: 48px 0;
  white-space: pre-line;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.8;
  }
`;

/**
 * 갤러리에서 사진 찾아오기 버튼
 * @param {string} label   버튼 텍스트 (기본: "갤러리에서 사진 찾아오기")
 * @param {function} onClick  클릭 핸들러
 */
const GallerySelectButton = ({ label = "갤러리에서 \n사진 찾아오기", onClick }) => {
  return (
    <ButtonContainer onClick={onClick}>
      <IoImageOutline size={60} />
      <span>{label}</span>
    </ButtonContainer>
  );
};

export default GallerySelectButton;