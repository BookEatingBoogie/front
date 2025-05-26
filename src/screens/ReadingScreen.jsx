import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsChevronLeft, BsVolumeUpFill } from 'react-icons/bs';
import HTMLFlipBook from 'react-pageflip';
import PopCard from '../components/PopCard';
import finishImg from '../assets/images/finish.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
`;

const BookWrapper = styled.div`
flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 2rem;
`;

const PageContent = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const PageImage = styled.img`
  max-width: 40%;
  max-height: 80%;
  object-fit: contain;
`;

const PageText = styled.div`
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const OverlayTop = styled.div`
  position: relative;
  width: 100%;
  background-color: #fff9ec;
  color: #1A202B;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const BackGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BackIcon = styled(BsChevronLeft)`
  font-size: 1.3rem;
  cursor: pointer;
`;

const TopTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const SoundButtonWrapper = styled.div`
  background-color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
`;

const SoundIcon = styled(BsVolumeUpFill)`
  font-size: 1.1rem;
  color: #1A202B;
  cursor: pointer;
`;

const OverlayBottom = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFF9EC;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: 10;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
`;

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
`;

const ProgressText = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #4A4A4A;
`;

const ProgressBarContainer = styled.div`
 width: 90vw;
  height: 6px;
  background-color: #e6e6e6;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 -1rem;
`;

const Progress = styled.div`
  height: 100%;
  width: ${(props) => `${props.$progress}%`};
  background-color: #FFC75F;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background-color: #FFF3C7;
  border: 1px solid #ccc;
  border-radius: 50px;
  padding: 0.4rem 1.2rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  &:hover {
    background-color: #FFEAA7;
  }
`;

const PlayButton = styled.button`
  background-color: #000;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default function ReadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileUrl = new URLSearchParams(location.search).get('file')?.replace(/^"|"$/g, '');

  const [title, setTitle] = useState('');
  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFinishPopup, setShowFinishPopup] = useState(false);

  const audioRef = useRef(null);
  const bookRef = useRef(null);

  const totalPages = texts.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fileUrl);
        const data = await res.json();
        const content = Array.isArray(data) ? data : data.content || [];
        setTitle(data.title || '제목 없음');
        setTexts(content.map(item => item.story));
        setImages(content.map(item => item.illustUrl));
      } catch (e) {
        console.error('fetch 실패:', e);
      }
    };

    if (fileUrl) fetchData();
  }, [fileUrl]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current.onended = null;
    }
    setIsSpeaking(false);
  };

  const speakText = async (text) => {
    stopAudio();
    try {
      const res = await fetch("http://localhost:5001/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          if (currentPage < totalPages - 1) {
            bookRef.current?.pageFlip().flipNext();
          } else {
            setShowFinishPopup(true);
          }
        };
        await audioRef.current.play();
        setIsSpeaking(true);
      }
    } catch (err) {
      console.error("TTS 오류:", err);
      setIsSpeaking(false);
    }
  };

  const handleFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    if (texts[newPage]) speakText(texts[newPage]);
  };

  const toggleTTS = () => {
    if (isSpeaking) stopAudio();
    else speakText(texts[currentPage]);
  };

  if (!texts.length || !images.length) return <div style={{ padding: '2rem' }}>불러오는 중...</div>;

  return (
    <Container>
      <OverlayTop>
        <BackGroup>
          <BackIcon onClick={() => navigate(-1)} />
          <TopTitle>{title}</TopTitle>
        </BackGroup>
        <SoundButtonWrapper onClick={toggleTTS}>
          <SoundIcon />
        </SoundButtonWrapper>
      </OverlayTop>
<BookWrapper>
<HTMLFlipBook
        width={800}
        height={600}
        size="fixed"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        maxShadowOpacity={0.5}
        showCover={false}
        mobileScrollSupport={false}
        useMouseEvents={true}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false}
        direction="rtl"
        ref={bookRef}
        onFlip={handleFlip}
      >
        {texts.map((text, idx) => (
          <Page key={idx}>
            <PageContent>
              <PageImage src={images[idx]} alt={`img-${idx}`} />
              <PageText>{text}</PageText>
            </PageContent>
          </Page>
        ))}
      </HTMLFlipBook>
</BookWrapper>
      

<OverlayBottom $visible={true}>
  <ProgressInfo>
    <ProgressText>{currentPage + 1}/{totalPages}</ProgressText>
    <ProgressBarContainer>
      <Progress $progress={progress} />
    </ProgressBarContainer>
  </ProgressInfo>
  <NavButtons>
    <NavButton onClick={(e) => { e.stopPropagation(); bookRef.current?.pageFlip().flipPrev(); }}>
      ◀ 이전 장으로
    </NavButton>
    <PlayButton onClick={(e) => { e.stopPropagation(); toggleTTS(); }}>
      {isSpeaking ? '⏸' : '▶'}
    </PlayButton>
    <NavButton onClick={(e) => { e.stopPropagation(); bookRef.current?.pageFlip().flipNext(); }}>
      다음 장으로 ▶
    </NavButton>
  </NavButtons>
</OverlayBottom>


      {showFinishPopup && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <PopCard
            imageSrc={finishImg}
            imageSize="150px"
            cardTitle="이야기 끝!"
            subTitle={`[${title}] 이야기를`}
            description="끝까지 다 읽었어요!"
            positiveBtnText="다시 보기"
            negativeBtnText="책장으로"
            onPositiveClick={() => {
              setShowFinishPopup(false);
              setCurrentPage(0);
              bookRef.current.pageFlip().turnToPage(0);
              speakText(texts[0]);
            }}
            onNegativeClick={() => {
              stopAudio();
              navigate('/bookshelf');
            }}
          />
        </div>
      )}

      <audio ref={audioRef} hidden />
    </Container>
  );
}
