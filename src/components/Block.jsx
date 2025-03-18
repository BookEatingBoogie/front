import styled from "styled-components"; 

const BlockContainer = styled.div`
display: flex;
padding: 0.25rem;
flex-direction: column;
align-items: center;
gap: 0.25rem;
width"128px;
height: 186px;
`
const IMG = styled.img`
width: 7.5rem;
height: 9.375rem;
border-radius: 0.3125rem;
background: url(<path-to-image>) lightgray 50% / cover no-repeat;
`
const Title = styled.div`
color: #000;
text-align: center;
font-family: Roboto;
font-size: 0.625rem;
font-style: normal;
font-weight: 400;
line-height: normal;
margin-bottom:-.3rem;
`

const Date = styled.div`
color: #000;
text-align: center;
font-family: Roboto;
font-size: 0.625rem;
font-style: normal;
font-weight: 400;
line-height: normal;
`
export default function Block({blockImg,blockName,creationDate}){
    return(
      <BlockContainer>
      <IMG src={blockImg}></IMG>
      <Title>{blockName}</Title>
      <Date>{creationDate}</Date>
    </BlockContainer>
    )

  
}