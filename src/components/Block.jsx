// Block.jsx
import styled from "styled-components";
import FavoriteButton from './FavoriteButton';

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 128px;
  cursor: pointer;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 7.5rem;
  height: 9.375rem;
`;

const IMG = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 0.3125rem;
  object-fit: cover;
  background-color: lightgray;
`;

const Title = styled.div`
  color: #000;
  text-align: center;
  font-family: Roboto;
  font-size: 0.625rem;
  font-weight: 400;
  margin-bottom: -0.3rem;
`;

const Date = styled.div`
  color: #000;
  text-align: center;
  font-family: Roboto;
  font-size: 0.625rem;
  font-weight: 400;
`;

const Checkbox = styled.input`
  position: absolute;
  top: 5px;
  left: 5px;
  transform: scale(1.2);
`;

export default function Block({
  blockImg,
  blockName,
  creationDate,
  storyId,
  isEditing = false,
  isSelected = false,
  onToggleSelect = () => {},
  showFavorite = true,
  hideDate = false,
  hideFavorite = false,
  onClick,
}) {
  return (
    <BlockContainer onClick={onClick}>
      <ImageWrapper>
        <IMG src={blockImg} alt={blockName || "story image"} />
        
        {/* 즐겨찾기 버튼은 명시적으로 숨겨야만 표시 안 되게 */}
        {!hideFavorite && showFavorite && storyId && !isEditing && (
          <FavoriteButton storyId={storyId} />
        )}
      </ImageWrapper>

      <Title>{blockName}</Title>

      {/* 날짜도 명시적으로 조건 체크 */}
      {!hideDate && <Date>{creationDate}</Date>}
    </BlockContainer>
  );
}
