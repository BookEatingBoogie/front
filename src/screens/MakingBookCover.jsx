import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';

const Container = styled.div`
  display: flex;
  padding: 2rem;
  background-color: #f2f2f2;
  border-radius: 1rem;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    align-items: center;
  }
`;

const CanvasSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
  text-align: center;
`;

const Canvas = styled.div`
  width: 500px;
  height: 340px;
  background-image: url('/bg.jpeg');
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    width: 90vw;
    height: 60vw;
  }
`;

const Sticker = styled.img`
  width: 60px;
  height: 60px;
  cursor: grab;
  user-select: none;
  pointer-events: all;
  -webkit-user-drag: none;
  touch-action: none;
`;

const CanvasText = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  color: #333;
  font-weight: bold;
  font-size: 1.3rem;
  top: 1rem;
  z-index: 10;
  text-shadow: 1px 1px 2px white;
`;

const CanvasAuthor = styled.div`
  position: absolute;
  bottom: 1rem;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  text-shadow: 1px 1px 2px white;
`;

const InputArea = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const Input = styled.input`
  width: 180px;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 0.375rem;
  font-size: 0.9rem;
`;

const SaveButton = styled.button`
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  background-color: #ffc75f;
  color: #333;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #ffb830;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ddd;
  padding: 1rem;
  border-radius: 1rem;
  min-width: 130px;
  max-height: 500px;

  @media (max-width: 768px) {
    flex-direction: row;
    max-height: none;
    overflow-y: visible;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const SidebarTitle = styled.div`
  font-size: 0.95rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
  flex-shrink: 0;
`;

const StickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 420px;

  @media (max-width: 768px) {
    flex-direction: row;
    max-height: none;
    overflow-y: visible;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const StickerOption = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  background-color: #fff;
  border: 2px solid #aaa;
  border-radius: 0.5rem;
  padding: 0.25rem;

  &:hover {
    border-color: #444;
  }
`;

export default function MakingBookCover() {
  const [stickers, setStickers] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleAddSticker = (src) => {
    setStickers([...stickers, { src, id: Date.now() }]);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    const canvasElement = canvasRef.current;
    const canvasImage = await html2canvas(canvasElement);
    const dataUrl = canvasImage.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `cover_${Date.now()}.png`;
    link.click();
  };

  const stickerList = [
    '/sticker_tokki.png',
    '/sticker_gold.png',
    '/sticker_magic.jpeg',
  ];

  return (
    <Container>
      <CanvasSection>
        <Title>동화책에 들어갈 그림을 만들어보아요!</Title>
        <Canvas ref={canvasRef}>
          <CanvasText>{title}</CanvasText>
          <CanvasAuthor>by {author}</CanvasAuthor>
          {stickers.map((s) => (
            <Draggable
              key={s.id}
              bounds="parent"
              enableUserSelectHack={false}
            >
              <Sticker src={s.src} />
            </Draggable>
          ))}
        </Canvas>

        <InputArea>
          <Input
            type="text"
            maxLength={10}
            placeholder="제목 (10자 이내)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="만든 사람 이름"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <SaveButton onClick={handleSave}>저장하기</SaveButton>
        </InputArea>
      </CanvasSection>

      <Sidebar>
        <SidebarTitle>스티커 사용하기</SidebarTitle>
        <StickerList>
          {stickerList.map((src, index) => (
            <StickerOption key={index} src={src} onClick={() => handleAddSticker(src)} />
          ))}
        </StickerList>
      </Sidebar>
    </Container>
  );
}
