import styled from 'styled-components';

const RoundedButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px 20px;
  border: 2px solid ${({ borderColor }) => borderColor || '#fff'};
  border-radius: 30px;
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  color: ${({ fontColor }) => fontColor || 'black'};
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

export default RoundedButton;