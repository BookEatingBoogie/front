import styled from "styled-components";
import FavoriteButton from './FavoriteButton';

const BlockContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 128px;
  cursor: pointer;
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
  position: relative;
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

export default function Block({
  blockImg,
  blockName,
  creationDate,
  onClick,
  hideDate = false,
  showFavorite = false,
  storyId
}) {
  return (
    <BlockContainer onClick={onClick}>
      <ImageWrapper>
        <IMG src={blockImg} alt={blockName || "story image"} />
        {showFavorite && storyId && (
          <FavoriteButton storyId={storyId} />
        )}
      </ImageWrapper>
      <Title>{blockName}</Title>
      {!hideDate && <Date>{creationDate}</Date>}
    </BlockContainer>
  );
}
