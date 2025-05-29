import styled from "styled-components";
import FavoriteButton from './FavoriteButton';

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 13rem; /* 기본값 */

  cursor: pointer;
  position: relative;
  overflow: hidden;

  @media (max-width: 360px) {
    width: 6rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    width: 9.5rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    width: 11rem;
  }

  @media (min-width: 1080px) and (max-width: 1439px) {
    width: 11rem;
  }

  @media (min-width: 1440px) {
    width: 13rem;
  }
`;

const Shadow = styled.div`
  margin-top: -1rem;
  width: 60%;
  height: 10px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7), transparent 70%);
  border-radius: 50%;
  align-self: center;
  pointer-events: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
`;

const IMG = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  height: auto;
  object-fit: cover;
  border-radius: 0.3125rem;
`;

const Title = styled.div`
  color: #000;
  text-align: center;
  font-weight: 400;
  font-size: 1rem;

  @media (max-width: 360px) {
    font-size: 0.75rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.85rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.95rem;
  }

  @media (min-width: 1080px) and (max-width: 1439px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 1.05rem;
  }
`;

const Date = styled.div`
  color: #000;
  text-align: center;
  font-weight: 200;
  font-size: 0.8rem;

  @media (max-width: 360px) {
    font-size: 0.65rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.7rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.75rem;
  }

  @media (min-width: 1080px) and (max-width: 1439px) {
    font-size: 0.8rem;
  }

  @media (min-width: 1440px) {
    font-size: 0.85rem;
  }
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
  withShadow = false,
}) {
  return (
    <BlockContainer onClick={onClick}>
      <ImageWrapper>
        <IMG src={blockImg} alt={blockName || "story image"} />
        {!hideFavorite && showFavorite && storyId && !isEditing && (
          <FavoriteButton storyId={storyId} />
        )}
      </ImageWrapper>
      {withShadow && <Shadow />}
      <Title>{blockName}</Title>
      {!hideDate && <Date>{creationDate}</Date>}
    </BlockContainer>
  );
}
