import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { storyInfoState, characterInfoState } from '../recoil/atoms';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Block from '../components/Block';
import Empty from '../components/Empty';
import PopCard from '../components/PopCard';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BookshelfContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => (props.$highlighted ? '#FFF9EC' : '#fff')};
  min-height: 100vh;
`;

const CharacterCategoryWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${(props) => (props.$highlighted ? '#FFF9EC' : '#fff')};
  position: relative;
`;

const CharacterCategoryContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 1rem;
  width: max-content;
  border-bottom: none;
`;

const CharacterCircle = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: ${(props) => (props.selected ? '2px solid #FFC75F' : '2px solid transparent')};
  background-color: ${(props) => (props.selected ? '#FFF9EC' : 'transparent')};
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 0.5rem;
  margin-bottom: 0;
  z-index: ${(props) => (props.selected ? 2 : 1)};
`;

const CharacterImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const CharacterLabel = styled.span`
  font-size: 0.75rem;
  color: ${(props) => (props.selected ? '#1A202B' : '#888')};
  font-weight: ${(props) => (props.selected ? '600' : '400')};
  margin-top: 0.3rem;
`;

const CharacterSectionTitle = styled.div`
  width: 100%;
  padding: 0.75rem 1rem 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #1A202B;
  text-align: center;
  background-color: #FFF9EC;
  margin-top: -0.25rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0.875rem 1rem 1.5rem 0.875rem;
  gap: 1rem;
  width: 100%;
  background-color: #FFF9EC;
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

export default function Bookshelf() {
  const storyList = useRecoilValue(storyInfoState);
  const characterList = useRecoilValue(characterInfoState);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const navigate = useNavigate();

  const handleBlockClick = (story) => {
    setSelectedStory(story);
  };

  const handleClosePopup = () => {
    setSelectedStory(null);
  };

  const filteredStoryList = selectedCharacter
    ? storyList.filter((story) => story.characters?.includes(selectedCharacter))
    : storyList;

  return (
    <BookshelfContainer $highlighted={!!selectedCharacter}>
      <Header pageName="내 책장" />

      <CharacterCategoryWrapper $highlighted={!!selectedCharacter}>
        <CharacterCategoryContainer>
          <CharacterCircle
            onClick={() => setSelectedCharacter(null)}
            selected={selectedCharacter === null}
          >
            <div style={{ width: 48, height: 48 }}></div>
            <CharacterLabel selected={selectedCharacter === null}>ALL</CharacterLabel>
          </CharacterCircle>

          {characterList.map((char) => (
            <CharacterCircle
              key={char.id}
              onClick={() => setSelectedCharacter(char.name)}
              selected={selectedCharacter === char.name}
            >
              <CharacterImg src={char.img} alt={char.name} />
              <CharacterLabel selected={selectedCharacter === char.name}>{char.name}</CharacterLabel>
            </CharacterCircle>
          ))}
        </CharacterCategoryContainer>
      </CharacterCategoryWrapper>

      {selectedCharacter && (
        <CharacterSectionTitle>
          {selectedCharacter}가 나오는 동화들
        </CharacterSectionTitle>
      )}

      <ContentContainer>
        {filteredStoryList.length > 0 ? (
          filteredStoryList.map((story) => (
            <Block
              key={story.id}
              blockImg={story.img?.[0] || story.cover?.testImg}
              blockName={story.title}
              creationDate={story.date}
              storyId={story.id}
              showFavorite={true}
              onClick={() => handleBlockClick(story)}
            />
          ))
        ) : (
          <Empty
            title="선택한 캐릭터의 동화가 없어요."
            description="다른 캐릭터를 선택해보세요!"
            buttonText="전체 보기"
            onButtonClick={() => setSelectedCharacter(null)}
          />
        )}
      </ContentContainer>

      {selectedStory && (
        <Overlay onClick={handleClosePopup}>
          <PopCard
            imageSrc={selectedStory.img?.[0] || selectedStory.cover?.testImg}
            cardTitle={selectedStory.title}
            subTitle={selectedStory.date}
            description={selectedStory.summary}
            positiveBtnText="열기"
            negativeBtnText="닫기"
            onPositiveClick={() => {
              handleClosePopup();
              navigate("/reading");
            }}
            onNegativeClick={handleClosePopup}
            titleFontSize="1.1rem"
            subFontSize="0.9rem"
            descriptionFontSize="0.8rem"
          />
        </Overlay>
      )}

      <BottomNav />
    </BookshelfContainer>
  );
}
