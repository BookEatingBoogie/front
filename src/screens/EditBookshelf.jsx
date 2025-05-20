import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { storyInfoState } from '../recoil/atoms';
import Block from '../components/Block';
import PopCard from '../components/PopCard';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { BsCheckCircle, BsCheckCircleFill } from 'react-icons/bs';

const Container = styled.div`
  background-color: #fff;
  min-height: 100vh;
`;

const DeleteBar = styled.div`
  width: 100%;
  background-color: #FF6B6B;
  text-align: center;
  padding: 0.75rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  justify-content: flex-start;
`;

const StoryWrapper = styled.div`
  position: relative;
  flex: 1 1 calc(50% - 1rem);

  @media (min-width: 480px) {
    flex: 1 1 calc(33.33% - 1rem);
  }

  @media (min-width: 768px) {
    flex: 1 1 calc(25% - 1rem);
  }

  @media (min-width: 1024px) {
    flex: 1 1 calc(20% - 1rem);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  color: #fff;
  font-size: 1.25rem;
  z-index: 10;
`;

export default function EditBookshelf() {
  const navigate = useNavigate();
  const [storyList, setStoryList] = useRecoilState(storyInfoState);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirm = () => {
    const updatedList = storyList.filter(story => !selectedIds.includes(story.id));
    setStoryList(updatedList);
    setShowPopup(false);
    navigate('/bookshelf');
  };

  return (
    <Container>
      <Header pageName="내 책장 편집하기" />

      <DeleteBar>
        <DeleteButton onClick={() => setShowPopup(true)}>삭제하기</DeleteButton>
      </DeleteBar>

      <Grid>
        {storyList.map((story) => (
          <StoryWrapper key={story.id} onClick={() => toggleSelect(story.id)}>
            <Block
              blockImg={story.img?.[0] || story.cover?.testImg}
              blockName={story.title}
              creationDate={story.date}
              storyId={story.id}
              hideDate={true}
              hideFavorite={true}
              isEditing={false}
            />
            <IconWrapper>
              {selectedIds.includes(story.id) ? <BsCheckCircleFill /> : <BsCheckCircle />}
            </IconWrapper>
          </StoryWrapper>
        ))}
      </Grid>

      {showPopup && (
        <Overlay>
          <PopCard
            useWarningIcon={true}
            titleColor="#EE5555"
            buttonDirection="column"
            cardTitle={`총 ${selectedIds.length}개의 동화를 삭제할까요?`}
            description="한 번 삭제되면 복구할 수 없어요."
            positiveBtnText="네, 이야기를 삭제할래요."
            negativeBtnText="아니요, 삭제하지 않을래요"
            onPositiveClick={handleDeleteConfirm}
            onNegativeClick={() => setShowPopup(false)}
            positiveBtnStyle={{
              padding: '0.5rem 1rem',
              border: '1px solid rgba(238, 85, 85, 0.50)',
              background: 'rgba(238, 85, 85, 0.20)',
              color: '#fff',
            }}
            negativeBtnStyle={{
              padding: '0.5rem 1rem',
              border: '1px solid rgba(253, 252, 250, 0.50)',
              background: 'rgba(253, 252, 250, 0.20)',
              color: '#fff',
            }}
          />
        </Overlay>
      )}
    </Container>
  );
}