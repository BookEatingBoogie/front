import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { RgbaColorPicker } from 'react-colorful';
import tinycolor from 'tinycolor2';
import AWS from 'aws-sdk';
import { useRecoilValue } from 'recoil';
import { coverImageState } from '../recoil/atoms';

// AWS 설정
const REGION = 'ap-northeast-2';
const BUCKET = 'bookeating';
const S3_BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/`;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

const s3 = new AWS.S3();


const CoverContainer = styled.div`
  display: flex;
  margin: 2rem auto 0;
  width: 90vw;
  padding: 2rem;
  background-color: #f2f2f2;
  border-radius: 1rem;
  justify-content: center;
  align-items: center;
  gap: 2rem;


  @media (max-width: 720px) {
    flex-direction: column;
    width: 90vw;
    padding: 1rem;
  }
`;

const CanvasSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  padding-bottom: 3rem;
`;


const Title = styled.div`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #001840;
  text-align: center;

  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 1.5rem;
  }
  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 1.8rem;
  }
`;

const Canvas = styled.div`
  aspect-ratio: 1;
  width: min(60vw, 60vh); /* 뷰포트 기준 너비와 높이 중 작은 값을 적용 */
  max-width: 500px;       /* 최대 크기 제한 */
  max-height: 500px;
  background-image: ${({ bg }) => `url(${bg || '/back.png'})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
`;



const CanvasText = styled.div`
  position: absolute;
  font-weight: 1000;
  font-size: 2rem;
  cursor: move;
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 1.5rem;
  }
  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 1.8rem;
  }
`;

const CanvasAuthor = styled.div`
  position: absolute;
  font-size: 1rem;
  font-weight: 800;
  cursor: move;
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 0.7rem;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.8rem;
  }
  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 0.9rem;
  }
`;

const StickerWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Sticker = styled.img`
  width: ${({ scale }) => 60 * scale}px;
  height: ${({ scale }) => 60 * scale}px;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
`;

const DeleteButton = styled.button`
  position: absolute;
  // top: -10px;
  // right: -10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  display: none;

  ${StickerWrapper}:hover & {
    display: block;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
  z-index: 2;
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

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;
const SaveButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  margin-top: 2rem;
  padding: 0.6rem 1.5rem;
  background-color: #ffc75f;
  color: #1A202B;
  border: none;
  border-radius: 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background-color: #ffb830;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.5rem 1.2rem;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ddd;
  padding: 1rem;
  border-radius: 1rem;
  width: 20rem;

  @media (max-width: 768px) {
    flex-direction: row;
    max-height: none;
    overflow-y: visible;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const SidebarTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: center;
  justifyt-content: center;
`;

const StickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 26.25rem;
  justifyt-content: center;
  @media (max-width: 768px) {
    flex-direction: row;
    max-height: none;
    overflow-y: visible;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const StickerOption = styled.img`
  width: 10rem;
  height: 10rem;
  cursor: pointer;
  background-color: #fff;
  border: 2px solid #aaa;
  border-radius: 0.5rem;
  padding: 0.25rem;
  text-align: center;
  justifyt-content: center;

  &:hover {
    border-color: #444;
  }
`;

const InputWithColorWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.5rem;
`;

const ColorButton = styled.button`
  margin-left: 0.5rem;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #f1f1f1;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.25rem 0.4rem;
  }
`;

const ColorPopover = styled.div`
  position: absolute;
  top: 2.5rem;
  left: 100%;
  margin-left: 0.5rem;
  z-index: 100;
`;


export default function MakingBookCover() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [step, setStep] = useState(1);
  const [stickers, setStickers] = useState([]);
  const [resizingId, setResizingId] = useState(null);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [authorPos, setAuthorPos] = useState({ x: 0, y: 0 });
  const [titleColor, setTitleColor] = useState({ r: 26, g: 32, b: 43, a: 1 });
  const [authorColor, setAuthorColor] = useState({ r: 26, g: 32, b: 43, a: 1 });
  const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
  const [showAuthorColorPicker, setShowAuthorColorPicker] = useState(false);
  const [stickerOptions, setStickerOptions] = useState([]);
  const canvasBg = useRecoilValue(coverImageState);

  const canvasBg = useRecoilValue(coverImageState);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/sticker/list`)
      .then((res) => {
        const unique = res.data.filter(
          (sticker, index, self) =>
            index === self.findIndex(s => s === sticker || s.url === sticker.url)
        );
        setStickerOptions(unique);
      })
      .catch((err) => console.error('스티커 리스트 불러오기 실패:', err));
  }, []);
  
   useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingId !== null) {
        setStickers((prev) =>
          prev.map((s) =>
            s.id === resizingId
              ? { ...s, scale: Math.max(0.3, Math.min(3, s.scale + (e.movementX + e.movementY) * 0.005)) }
              : s
          )
        );
      }
    };
    const handleMouseUp = () => setResizingId(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingId]);

  const handleSave = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (!title || !author) {
      alert("제목과 만든 사람 이름을 입력해주세요.");
      return;
    }

    if (canvasRef.current) {
      const canvasImage = await html2canvas(canvasRef.current);
      const blob = await new Promise(resolve => canvasImage.toBlob(resolve, 'image/png'));
      const file = new File([blob], `cover_${Date.now()}.png`, { type: 'image/png' });
      const s3Url = await s3.upload({
        Bucket: BUCKET,
        Key: `cover/${file.name}`,
        Body: file,
        ContentType: file.type,
      }).promise();

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/story/cover`, {
        title,
        coverImg: s3Url.Location,
      });

      alert("표지 저장 완료");
      navigate('/bookshelf');
    }
  };

  return (
    <CoverContainer>
      <CanvasSection>
        <Title>동화책에 들어갈 그림을 만들어보아요!</Title>
        <Canvas ref={canvasRef} bg={canvasBg}>


          {stickers.map(s => (
            <Draggable key={s.id} bounds="parent" defaultPosition={{ x: s.x, y: s.y }}
              onStop={(e, data) =>
                setStickers(prev =>
                  prev.map(item =>
                    item.id === s.id ? { ...item, x: data.x, y: data.y } : item
                  )
                )
              }>
              <StickerWrapper>
                <Sticker src={s.src} scale={s.scale} onMouseDown={() => setSelectedStickerId(s.id)}
                  style={{
                    border: resizingId === s.id ? '2px dashed #ff9900' : 'none',
                    boxSizing: 'border-box',
                  }} />
                <DeleteButton onClick={() => setStickers(prev => prev.filter(st => st.id !== s.id))}>×</DeleteButton>
                <ResizeHandle onMouseDown={() => setResizingId(s.id)} />
              </StickerWrapper>
            </Draggable>
          ))}
          {step === 2 && (
            <>
              <Draggable bounds="parent" defaultPosition={textPos}
                onStop={(e, data) => setTextPos({ x: data.x, y: data.y })}>
                <CanvasText style={{ color: `rgba(${titleColor.r},${titleColor.g},${titleColor.b},${titleColor.a})` }}>
                  {title}
                </CanvasText>
              </Draggable>
              <Draggable bounds="parent" defaultPosition={authorPos}
                onStop={(e, data) => setAuthorPos({ x: data.x, y: data.y })}>
                <CanvasAuthor style={{ color: `rgba(${authorColor.r},${authorColor.g},${authorColor.b},${authorColor.a})` }}>
                  지은이: {author}
                </CanvasAuthor>
              </Draggable>
            </>
          )}
        </Canvas>

        {step === 2 && (
          <InputArea>
            <InputWithColorWrapper>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" maxLength={10} />
              <ColorButton onClick={() => setShowTitleColorPicker(prev => !prev)}>색상</ColorButton>
              {showTitleColorPicker && (
                <ColorPopover>
                  <RgbaColorPicker color={titleColor} onChange={setTitleColor} />
                </ColorPopover>
              )}
            </InputWithColorWrapper>

            <InputWithColorWrapper>
              <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="만든 사람" maxLength={5} />
              <ColorButton onClick={() => setShowAuthorColorPicker(prev => !prev)}>색상</ColorButton>
              {showAuthorColorPicker && (
                <ColorPopover>
                  <RgbaColorPicker color={authorColor} onChange={setAuthorColor} />
                </ColorPopover>
              )}
            </InputWithColorWrapper>
          </InputArea>
        )}
       <SaveButtonWrapper>
  <SaveButton onClick={handleSave}>
    {step === 1 ? '다음 단계로' : '저장하기'}
  </SaveButton>
</SaveButtonWrapper>

      </CanvasSection>

      {step === 1 && (
        <Sidebar>
          <SidebarTitle>스티커 사용하기</SidebarTitle>
          <StickerList>
            {stickerOptions.map((src, i) => (
              <StickerOption key={i} src={src} onClick={() => setStickers(prev => [...prev, {
                src, id: Date.now(), scale: 1, x: 0, y: 0
              }])} />
            ))}
          </StickerList>
        </Sidebar>
      )}

      
    </CoverContainer>
  );
}