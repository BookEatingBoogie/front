import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  color: #fff;
  gap: 0;
  font-size: 14px;
  z-index: 3;
`;

const ProgressText = styled.div`
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
`;

const ProgressBarBackground = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #ffcc00;
  width: ${({ fillPercent }) => fillPercent}%;
  transition: width 0.3s ease;
`;

const Title = styled.h1`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #fff;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  position: absolute;
  top: 130px; /* Title보다 아래 */
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #fff;
  margin: 0;
  text-align: center;
  line-height: 1.4;
  width: 80%;
  max-width: 400px;
  white-space: pre-line;
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 200px; 
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
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
 * @param {string} progressText     상단 왼쪽 진행 표시 (예: "1/6")
 * @param {number} progressCurrent  현재 단계 (게이지용)
 * @param {number} progressTotal    전체 단계 (게이지용)
 * @param {string} title            큰 타이틀
 * @param {string} subTitle         서브 타이틀
 * @param {ReactNode} children      중앙 영역 콘텐츠
 * @param {string} imageSrc         이미지 경로 (없으면 표시 안 함)
 * @param {string} imageAlt         이미지 대체 텍스트
 * @param {number} imageWidth       이미지 너비(px) (기본 360)
 * @param {number} imageBottom      이미지 하단 위치(px) (기본 100)
 */
const BaseScreenLayout = ({
  progressText,
  progressCurrent,
  progressTotal,
  title,
  subTitle,
  children,
  imageSrc,         // 다양한 이미지 경로 (예: 사람 얼굴, 도깨비, etc.)
  imageAlt = "",
  imageWidth = 360,    // 기본값 360px
  imageBottom = 100,   // 기본값 100px
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
          {progressCurrent && progressTotal && (
            <ProgressBarBackground>
              <ProgressBarFill fillPercent={fillPercent} />
            </ProgressBarBackground>
          )}
        </ProgressContainer>
      )}
      {title && <Title>{title}</Title>}
      {subTitle && <SubTitle>{subTitle}</SubTitle>}

      <ContentWrapper>{children}</ContentWrapper>

      {/* imageSrc가 있으면 이미지 렌더링, 없으면 비움 */}
      {imageSrc && (
        <LayoutImage
          src={imageSrc}
          alt={imageAlt}
          style={{
            width: `${imageWidth}px`,
            bottom: `${imageBottom}px`,
          }}
        />
      )}
    </Container>
  );
};

export default BaseScreenLayout;