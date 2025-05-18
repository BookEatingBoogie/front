import React from 'react';
import styled from 'styled-components';

const breakpoints = {
  sm: '360px',
  md: '720px',
  lg: '1080px',
  xl: '1440px',
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 1.25rem;          /* 20px → 20/16 = 1.25rem */
  left: 1.25rem;         /* 20px → 1.25rem */
  right: 1.25rem;        /* 20px → 1.25rem */
  display: flex;
  flex-direction: column;
  color: #fff;
  gap: 0;                /* 0 stays the same */
  font-size: 0.875rem;   /* 14px → 14/16 = 0.875rem */
  z-index: 3;
`;

const ProgressText = styled.div`
  color: #fff;
  font-size: 0.875rem;   /* 14px → 0.875rem */
  white-space: nowrap;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 0.5rem;        /* 8px → 8/16 = 0.5rem */
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;/* 4px → 4/16 = 0.25rem */
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #ffae00;
  width: ${({ fillPercent }) => fillPercent}%;
  transition: width 0.3s ease;
`;

const Title = styled.h1`
  position: absolute;
  top: 3.75rem;          /* 60px → 60/16 = 3.75rem */
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;     /* 24px → 24/16 = 1.5rem */
  color: #fff;
  margin: 0;
  text-align: center;
  white-space: pre-line;
  @media (min-width: ${breakpoints.md}) {
    font-size: 1.6rem;
  }
  @media (min-width: ${breakpoints.lg}) {
    font-size: 1.8rem;
  }
  @media (min-width: ${breakpoints.xl}) {
    font-size: 2rem;
  }  
`;

const SubTitle = styled.p`
  position: absolute;
  top: 8.125rem;         /* 130px → 130/16 = 8.125rem */
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;   /* 14px → 0.875rem */
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  width: 80%;
  max-width: 25rem;      /* 400px → 400/16 = 25rem */
  white-space: pre-line;
  @media (min-width: ${breakpoints.md}) {
    max-width: 40rem;
    font-size: 1rem;
  }
  @media (min-width: ${breakpoints.lg}) {
    top: 9rem;
    max-width: 60rem;
    font-size: 1.125rem;
  }
  @media (min-width: ${breakpoints.xl}) {
    top: 10rem;
    max-width: 80rem;
    font-size: 1.14rem;
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 12.5rem;          /* 200px → 200/16 = 12.5rem */
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 25rem;      /* 400px → 25rem */
  text-align: center;
  z-index: 2;
`;

const LayoutImage = styled.img`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: auto;
  z-index: 1;
`;

/**
 * BaseScreenLayout
 * @param {string}  progressText
 * @param {number}  progressCurrent
 * @param {number}  progressTotal
 * @param {string}  title
 * @param {string}  subTitle
 * @param {ReactNode} children
 * @param {string}  imageSrc
 * @param {string}  imageAlt
 * @param {number}  imageWidth   // px value
 * @param {number}  imageBottom  // px value
 */
const BaseScreenLayout = ({
  progressText,
  progressCurrent,
  progressTotal,
  title,
  subTitle,
  children,
  imageSrc,
  imageAlt = "",
  imageWidth = 360,    // px
  imageBottom = 100,   // px
}) => {
  let fillPercent = 0;
  if (
    typeof progressCurrent === 'number' &&
    typeof progressTotal === 'number' &&
    progressTotal > 0
  ) {
    fillPercent = (progressCurrent / progressTotal) * 100;
  }

  return (
    <Container>
      {(progressText || (progressCurrent && progressTotal)) && (
        <ProgressContainer>
          {progressText && <ProgressText>{progressText}</ProgressText>}
          {progressCurrent !== undefined && progressTotal !== undefined && (
            <ProgressBarBackground>
              <ProgressBarFill fillPercent={fillPercent} />
            </ProgressBarBackground>
          )}
        </ProgressContainer>
      )}
      {title && <Title>{title}</Title>}
      {subTitle && <SubTitle>{subTitle}</SubTitle>}

      <ContentWrapper>{children}</ContentWrapper>

      {imageSrc && (
        <LayoutImage
          src={imageSrc}
          alt={imageAlt}
          style={{
            width: `${imageWidth / 16}rem`,    /* px → rem */
            bottom: `${imageBottom / 16}rem`,  /* px → rem */
          }}
        />
      )}
    </Container>
  );
};

export default BaseScreenLayout;