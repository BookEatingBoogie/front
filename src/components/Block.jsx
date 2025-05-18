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
   overflow: hidden; 
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  max-width: 180px;
  border-radius: 25px;
  border: 0.5px solid #1A202B;
   overflow: hidden; 
  ${(props) =>
    props.withShadow &&
    `box-shadow: 15px 15px 15px -15px rgba(26, 32, 43, 1);`}
`;


const IMG = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3; /* 512:768 비율 유지 */
  height: auto;
  object-fit: cover;
  border-radius: 0.3125rem;
  // background-color: rgba(251, 246, 229, 0.7);
`;

const Title = styled.div`
  color: #000;
  text-align: center;
  font-family: Roboto;
  font-size: 0.625rem;
  font-weight: 400;
  margin-bottom: 0.3rem;
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
  customSize = false,
  withShadow = false
  
}) {
  return (
    <BlockContainer onClick={onClick}>
      <ImageWrapper withShadow={withShadow}>
        <IMG
          src={blockImg}
          alt={blockName || "story image"}
          customSize={customSize}
        />
        {!hideFavorite && showFavorite && storyId && !isEditing && (
          <FavoriteButton storyId={storyId} />
        )}
      </ImageWrapper>
      <Title>{blockName}</Title>
      {!hideDate && <Date>{creationDate}</Date>}
    </BlockContainer>
  );
}
