import styled from "styled-components";
import { BsExclamationTriangleFill } from 'react-icons/bs';

const CardContainer = styled.div`
  display: flex;
  padding: 2rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border-radius: 1.5625rem;
  background: #1C212A;
  width: 268px;
  height: 430px;

  @media (max-width: 360px) {
    width: 220px;
    height: 370px;
    padding: 1.25rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    width: 240px;
    height: 400px;
    padding: 1.5rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    width: 260px;
    height: 420px;
  }

  @media (min-width: 1080px) and (max-width: 1439px) {
    width: 268px;
    height: 430px;
  }

  @media (min-width: 1440px) {
    width: 280px;
    height: 440px;
  }
`;

const IMG = styled.img`
  margin-top: -4rem;
  width: ${(props) => props.imageWidth || '100%'};
  aspect-ratio: 2 / 3;
  object-fit: contain;
  border-radius: ${(props) => props.cornerRadius || '10px'};
  background-color: transparent;
`;

const Title = styled.div`
  color: ${(props) => props.color || '#FFF'};
  text-align: center;
  font-size: ${(props) => props.fontSize || '1rem'};
  font-weight: 700;

  @media (max-width: 360px) {
    font-size: 0.85rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.9rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.95rem;
  }
`;

const SubTitle = styled.div`
  color: #FFF;
  text-align: center;
  font-size: ${(props) => props.fontSize || '0.9rem'};
  font-weight: 500;

  @media (max-width: 360px) {
    font-size: 0.75rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.8rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.85rem;
  }
`;

const DIV = styled.div`
  color: #FFF;
  text-align: center;
  font-size: ${(props) => props.fontSize || '0.8125rem'};
  font-weight: 400;
  white-space: pre-line;

  @media (max-width: 360px) {
    font-size: 0.7rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.75rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.8rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
`;

const PositiveButton = styled.button`
  display: flex;
  padding: ${(props) => props.padding || '0.25rem 1rem'};
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6.25rem;
  border: ${(props) => props.border || 'none'};
  background: ${(props) => props.background || '#FFC75F'};
  color: ${(props) => props.color || '#000'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  @media (max-width: 360px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

const NegativeButton = styled.button`
  display: flex;
  padding: ${(props) => props.padding || '0.25rem 1rem'};
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 6.25rem;
  border: ${(props) => props.border || '1px solid #ccc'};
  background: ${(props) => props.background || '#FFF'};
  color: ${(props) => props.color || '#000'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  @media (max-width: 360px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

export default function PopCard({
  imageSrc,
  imageSize,
  cornerRadius,
  cardTitle,
  subTitle,
  description,
  positiveBtnText,
  negativeBtnText,
  onPositiveClick,
  onNegativeClick,
  titleFontSize,
  subFontSize,
  descriptionFontSize,
  positivePadding,
  positiveBorder,
  positiveBackground,
  positiveColor,
  negativePadding,
  negativeBorder,
  negativeBackground,
  negativeColor,
  useWarningIcon = false,
}) {
  return (
    <CardContainer>
    {imageSrc ? (
      <IMG src={imageSrc} imageWidth={imageSize} cornerRadius={cornerRadius} />
    ) : useWarningIcon ? (
      <BsExclamationTriangleFill size={50} color="#EE5555" />
    ) : null}
  
    <Title fontSize={titleFontSize}>{cardTitle}</Title>
    <SubTitle fontSize={subFontSize}>{subTitle}</SubTitle>
    <DIV fontSize={descriptionFontSize}>{description}</DIV>
    <ButtonContainer>
      {positiveBtnText && (
        <PositiveButton
          padding={positivePadding}
          border={positiveBorder}
          background={positiveBackground}
          color={positiveColor}
          onClick={onPositiveClick}
        >
          {positiveBtnText}
        </PositiveButton>
      )}
      {negativeBtnText && (
        <NegativeButton
          padding={negativePadding}
          border={negativeBorder}
          background={negativeBackground}
          color={negativeColor}
          onClick={onNegativeClick}
        >
          {negativeBtnText}
        </NegativeButton>
      )}
    </ButtonContainer>
  </CardContainer>
  
  );
}
