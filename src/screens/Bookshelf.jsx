import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Block from '../components/Block';
import Empty from '../components/Empty';
import PopCard from '../components/PopCard';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import defaultImg from '../assets/images/testImg.png';
import { useSetRecoilState } from 'recoil';
import { storyInfoState,favoriteStoryIdsState } from '../recoil/atoms';

const BookshelfContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  min-height: 100vh;
  height: 300vh;
  position: relative;
`;

const EditButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem 0.5rem 1rem;
`;

const EditButton = styled.button`
  border-radius: 6.25rem;
  border: 1px solid rgba(57, 61, 64, 0.5);
  background: rgba(243, 243, 243, 0.58);
  color: #1A202B;
  font-size: 1rem;
  font-weight: 300;
  display: flex;
  padding: 0.25rem 1rem;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 360px) {
    font-size: 0.85rem;
    padding: 0.2rem 0.75rem;
  }

  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.9rem;
    padding: 0.2rem 0.75rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.95rem;
    padding: 0.22rem 0.9rem;
  }

  @media (min-width: 1080px) and (max-width: 1439px) {
    font-size: 1rem;
    padding: 0.25rem 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 1.05rem;
    padding: 0.3rem 1.2rem;
  }
`;

const Separator = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0.25rem 0;
`;

const CharacterCategoryWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: #fff;
  margin-top: 1rem;
`;

const CharacterCategoryContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 0;
  width: max-content;
  margin-left: 0.5rem;
`;

const CharacterCircle = styled.div`
  width: 6rem;       
  height: 5rem;   
  overflow: hidden;
  border: ${(props) => (props.selected ? '0.125rem solid #FFC75F' : '0.0625rem solid #ccc')}; // 2px / 1px
  background-color: ${(props) => (props.selected ? '#FFF9EC' : '#fff')};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 2rem 2rem 0 0;
  flex-shrink: 0;

  @media (max-width: 720px) {
    width: 4rem;
    height: 4rem;
  }


`;

const CharacterImg = styled.img`
  width: auto;
  height: 12.5rem;
  object-fit: cover;
  transform: translateY(3rem);
`;

const CharacterLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 5rem;
`;

const CharacterLabel = styled.span`
  font-size: 0.75rem;
  color: ${(props) => (props.selected ? '#1A202B' : '#888')};
  font-weight: ${(props) => (props.selected ? '600' : '400')};
  margin-top: 0.3rem;
  text-align: center;
`;

const CharacterSectionTitle = styled.div`
  width: 100%;
  padding: 1rem 1rem 0.5rem 1rem;
  font-weight: 600;
  font-size: 1.5rem;
  color: #1A202B;
  text-align: center;
  background-color: ${(props) => (props.$hasContent ? '#FFF9EC' : '#fff')};
  @media  (max-width: 719px) {
    font-size: 1rem;
  }

  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 1.2rem;
  }

  @media (min-width: 1080px) and (max-width: 1439px) {
    font-size: 2rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.875rem 1rem 1.5rem 0.875rem;
  gap: 1rem;
  width: 100%;
  min-height: 50vh;
`;

const HighlightedWrapper = styled.div`
  width: 100%;
  background-color: ${(props) => (props.active ? '#FFF9EC' : '#fff')};
  height: 100vh;
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
  const [storyList, setStoryList] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [selectedCharacterName, setSelectedCharacterName] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setFavoriteStoryIds = useSetRecoilState(favoriteStoryIdsState);
  const setStoryInfoState = useSetRecoilState(storyInfoState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/mypage/story`);
        const stories = res.data.stories || [];

        setStoryList(stories);
        setStoryInfoState(res.data.stories || []); //즐겨찾기를 위해 리코일에 저장 
        setCharacterList(res.data.characters || []);

        // 진단 로그
      console.log('characters:', res.data.characters);
      console.log('stories:', res.data.stories.map(s => ({
        id: s.storyId,
        title: s.title,
        characters: s.characters
      })));
      const favoriteIds = stories.filter(s => s.favorite).map(s => s.storyId);
      setFavoriteStoryIds(favoriteIds);
      } catch (err) {
        console.error('데이터 불러오기 실패', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBlockClick = (story) => setSelectedStory(story);
  const handleClosePopup = () => setSelectedStory(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  const filteredStoryList = selectedCharacterId
  ? storyList.filter((story) =>
      String(story.charId) === String(selectedCharacterId)
    )
  : storyList;



  const isActiveBg = selectedCharacterId !== null && filteredStoryList.length > 0;

  return (
    <BookshelfContainer>
      {!loading && storyList.length > 0 && <Header pageName={"내 책장"} />}

      {characterList.length > 0 && (
  <CharacterCategoryWrapper>
    <CharacterCategoryContainer>
    <CharacterLabelWrapper>
    <CharacterCircle 
      onClick={() => {
        setSelectedCharacterId(null);
        setSelectedCharacterName(null);
      }}
      selected={selectedCharacterId === null}
    >
      <span style={{
        fontWeight: '600',
        color: '#1A202B',
        fontSize: '1.2rem'
      }}>
      전체
    </span>
  </CharacterCircle>
  <CharacterLabel selected={selectedCharacterId === null}>　</CharacterLabel>
</CharacterLabelWrapper>


      {characterList.map((char) => (
        <CharacterLabelWrapper key={char.charId}>
          <CharacterCircle
            onClick={() => {
              setSelectedCharacterId(char.charId);
              setSelectedCharacterName(char.charName);
            }}
            selected={selectedCharacterId === char.charId}
          >
            <CharacterImg src={char.charImg || defaultImg} alt={char.charName} />
          </CharacterCircle>
          <CharacterLabel selected={selectedCharacterId === char.charId}>
            {char.charName}
          </CharacterLabel>
        </CharacterLabelWrapper>
      ))}
    </CharacterCategoryContainer>
  </CharacterCategoryWrapper>
)}


      <Separator />

      {characterList.length > 0 ? (
        <>
          {selectedCharacterId === null && (
            <EditButtonWrapper>
              <EditButton onClick={() => navigate('/edit-bookshelf')}>
                편집하기
              </EditButton>
            </EditButtonWrapper>
          )}

          {selectedCharacterId !== null && filteredStoryList.length > 0 && (
            <CharacterSectionTitle $hasContent={true}>
              <span style={{
                  fontWeight: '600',
                  fontSize: '1.5rem'
                }}>
                {selectedCharacterName}
              </span>
              (이)가 나오는 동화들
            </CharacterSectionTitle>
          )}

          <HighlightedWrapper active={isActiveBg}>
            <ContentContainer>
              {filteredStoryList.length > 0 ? (
                filteredStoryList.map((story) => (
                  <Block
                    key={story.storyId}
                    blockImg={story.coverImg}
                    blockName={story.title}
                    creationDate={formatDate(story.creationDate)}
                    storyId={story.storyId}
                    showFavorite={true}
                    onClick={() => handleBlockClick(story)}
                    withShadow={false}
                  />
                ))
              ) : (
                <div style={{ width: '100%', backgroundColor: '#fff', flexGrow: 1 }}>
                  <Empty
                    title="선택한 캐릭터의 동화가 없어요."
                    description="다른 캐릭터를 선택해보세요!"
                    buttonText="전체 보기"
                    onButtonClick={() => {
                      setSelectedCharacterId(null);
                      setSelectedCharacterName(null);
                    }}
                  />
                </div>
              )}
            </ContentContainer>
          </HighlightedWrapper>
        </>
      ) : (
        <ContentContainer>
          <Empty
            title="등록된 캐릭터가 없습니다."
            description="캐릭터를 등록해주세요!"
            buttonText="캐릭터 등록"
            onButtonClick={() => navigate('/create-character')}
          />
        </ContentContainer>
      )}

      {selectedStory && (
        <Overlay onClick={handleClosePopup}>
          <PopCard
            imageSrc={selectedStory.coverImg || defaultImg}
            imageSize="10rem"
            cardTitle={selectedStory.title}
            positiveBtnText="열기"
            negativeBtnText="닫기"
            onPositiveClick={() => {
              handleClosePopup();
              navigate(`/reading?file=${encodeURIComponent(selectedStory.content)}&title=${encodeURIComponent(selectedStory.title)}`);
            }}
            onNegativeClick={handleClosePopup}
          />
        </Overlay>
      )}

      <BottomNav />
    </BookshelfContainer>
  );
}
