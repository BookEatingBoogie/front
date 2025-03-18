import styled from "styled-components";

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
`;

const IMG = styled.img`
  width: ${(props) => props.size || '150px'}; /* 기본 사이즈 설정 */
  height: ${(props) => props.size || '150px'};
  border-radius: ${(props) => props.cornerRadius || '10px'}; /* corner-radius 적용 */
  object-fit: cover;
`;

const Title = styled.div`
  color: #FFF;
  text-align: center;
  font-family: Pretendard;
  font-size: ${(props) => props.fontSize || '1rem'};
  font-weight: 700;
`;

const SubTitle = styled.div`
  color: #FFF;
  text-align: center;
  font-family: Pretendard;
  font-size: ${(props) => props.fontSize || '0.9rem'};
  font-weight: 500;
`;

const DIV = styled.div`
  color: #FFF;
  text-align: center;
  font-family: Pretendard;
  font-size: ${(props) => props.fontSize || '0.8125rem'};
  font-weight: 400;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
`;

const PositiveButton = styled.button`
  display: flex;
  padding: 0.25rem 1rem;
  align-items: center;
  border-radius: 6.25rem;
  background: #FFC75F;
  border: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #ffb84d;
  }
`;

const NegativeButton = styled.button`
  display: flex;
  padding: 0.25rem 1rem;
  align-items: center;
  border-radius: 6.25rem;
  background: #FFF;
  border: 1px solid #ccc;
  color: #000;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
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
}) {
  return (
    <CardContainer>
      <IMG src={imageSrc} size={imageSize} cornerRadius={cornerRadius} />
      <Title fontSize={titleFontSize}>{cardTitle}</Title>
      <SubTitle fontSize={subFontSize}>{subTitle}</SubTitle>
      <DIV fontSize={descriptionFontSize}>{description}</DIV>
      <ButtonContainer>
        {positiveBtnText && (
          <PositiveButton onClick={onPositiveClick}>{positiveBtnText}</PositiveButton>
        )}
        {negativeBtnText && (
          <NegativeButton onClick={onNegativeClick}>{negativeBtnText}</NegativeButton>
        )}
      </ButtonContainer>
    </CardContainer>
  );
}
