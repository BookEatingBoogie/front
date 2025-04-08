import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { storyInfoState, favoriteStoryIdsState } from '../recoil/atoms';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Block from '../components/Block';
import Empty from '../components/Empty';
import PopCard from '../components/PopCard';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FavoriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0.875rem 1rem 1.5rem 0.875rem;
  gap: 1rem;
  width: 100%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(28, 28, 28, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export default function Favorite() {
  const allStories = useRecoilValue(storyInfoState);
  const favoriteIds = useRecoilValue(favoriteStoryIdsState);
  const [selectedStory, setSelectedStory] = useState(null);
  const navigate = useNavigate(); // ✅ 책장으로 이동 버튼용

  // 즐겨찾기된 story만 필터링
  const favoriteStories = Array.isArray(allStories)
    ? allStories.filter(story => favoriteIds.includes(story.id))
    : [];

  const handleBlockClick = (story) => {
    setSelectedStory(story);
  };

  const handleClosePopup = () => {
    setSelectedStory(null);
  };
  
  return (
    <FavoriteContainer>
      <Header pageName="즐겨찾기" />
      <ContentContainer>
        {favoriteStories.length > 0 ? (
          favoriteStories.map((story) => (
            <Block
              key={story.id}
              blockImg={story.img?.[0] || story.cover}
              blockName={story.title}
              creationDate={story.date}
              storyId={story.id}
              showFavorite={true}
              onClick={() => handleBlockClick(story)}
            />
          ))
        ) : (
          <Empty
            title="즐겨찾기한 동화가 없어요"
            description="마음에 드는 동화를 별표로 저장해보세요!"
            buttonText="책장으로 돌아가기"
            onButtonClick={() => navigate('/bookshelf')} // ✅ 책장 이동 처리
          />
        )}
      </ContentContainer>

      {selectedStory && (
        <Overlay onClick={handleClosePopup}>
          <PopCard
            imageSrc={selectedStory.img?.[0] || selectedStory.cover}
            cardTitle={selectedStory.title}
            subTitle={selectedStory.date}
            description={selectedStory.summary}
            positiveBtnText="열기"
            negativeBtnText="닫기"
            onPositiveClick={() => console.log("책 열기")}
            onNegativeClick={handleClosePopup}
            titleFontSize="1.1rem"
            subFontSize="0.9rem"
            descriptionFontSize="0.8rem"
          />
        </Overlay>
      )}

      <BottomNav />
    </FavoriteContainer>
  );
}
