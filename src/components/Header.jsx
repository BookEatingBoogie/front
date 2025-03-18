import react from "react";
import styled from 'styled-components';

const HeaderContainer = styled.header`
    display: flex;
    flexed-direction: column;
    height: 412px
    display: flex;
    padding: 1.5rem;
    align-items: center;
    gap: 2rem;
    align-self: stretch;
    border-bottom: 0.2px solid rgba(0, 0, 0, 0.50);
background: #000;
`
const Title = styled.div`
    color: #FFF;
    text-align: center;
    font-family: Pretendard;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.03rem;
`
export default function Header({pageName}) {
    return (
        <HeaderContainer> 
        <Title>{pageName}</Title> 
    </HeaderContainer>
    );
}