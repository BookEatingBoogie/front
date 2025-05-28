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
  width: 100;
  background-color: #ffffff;
  
`;

const BookWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 1rem;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;

  @media (min-width: 720px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;
  }
`;


const PageImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  max-width: 50%;
  max-height: 100%;
  border-radius: 1rem;

  @media (min-width: 360px) {
    max-height: 75vh;
  }

  @media (min-width: 720px) {
    width: auto;
    max-width: 48%;
    max-height: 80vh;
  }

  @media (min-width: 1080px) {
    max-width: 45%;
  }

  @media (min-width: 1440px) {
    max-width: 40%;
  }
`;
const PageText = styled.div`
  width: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center; // 여기만 center로
  text-align: center;
  overflow-y: auto;
  height: 100%;
  max-height: 80vh;
  color: #000;

  @media (min-width: 720px) {
    max-height: 70vh;
  }
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60vw;

  @media (min-width: 720px) {
    font-size: 1.25rem;
    max-width: 70vw;
  }

  @media (min-width: 1080px) {
    font-size: 1.4rem;
    max-width: 75vw;
  }

  @media (min-width: 1440px) {
    font-size: 1.6rem;
    max-width: 80vw;
  }
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: 10;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 360px) {
    padding: 0.5rem;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    padding: 0.75rem;
  }
  @media (min-width: 1080px) {
    padding: 1.25rem;
  }
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

  @media (max-width: 360px) {
    width: 85vw;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    width: 88vw;
  }
  @media (min-width: 1440px) {
    width: 92vw;
  }
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
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  &:hover {
    background-color: #FFEAA7;
  }

  @media (max-width: 360px) {
    font-size: 0.8rem;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    font-size: 0.9rem;
  }
  @media (min-width: 720px) and (max-width: 1079px) {
    font-size: 1rem;
  }
  @media (min-width: 1080px) {
    font-size: 1.1rem;
  }
`;

const PlayButton = styled.button`
  background-color: #000;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 2.8rem;
  height: 2.8rem;

  @media (max-width: 360px) {
    width: 2.2rem;
    height: 2.2rem;
  }
  @media (min-width: 361px) and (max-width: 719px) {
    width: 2.5rem;
    height: 2.5rem;
  }
  @media (min-width: 1080px) {
    width: 3rem;
    height: 3rem;
  }
`;
function getScaledText(text) {
  const length = text.length;
  if (length > 600) return 0.65;
  if (length > 500) return 0.7;
  if (length > 400) return 0.8;
  if (length > 300) return 0.9;
  return 1;
}
export default function ReadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileUrl = new URLSearchParams(location.search).get('file')?.replace(/^"|"$/g, '');
  const titleFromQuery = new URLSearchParams(location.search).get('title') || '';

  const [title, setTitle] = useState(titleFromQuery || '제목 없음');
  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFinishPopup, setShowFinishPopup] = useState(false);

  const { width, height } = useWindowSize(); //flipbook 사이즈 조절용 
  const audioRef = useRef(null);
  const bookRef = useRef(null);
  const [uiVisible, setUiVisible] = useState(true);
  const uiTimeoutRef = useRef(null);
  
  const totalPages = texts.length * 2;
const progress = ((currentPage + 1) / totalPages) * 100;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fileUrl);
        const data = await res.json();
        const content = Array.isArray(data) ? data : data.content || [];

        setTitle(data.title || titleFromQuery || '제목 없음');
        
        setTexts(content.map(item => item.story));
        setImages(content.map(item => item.illustUrl));
        console.log("titleFromQuery:", titleFromQuery);

      } catch (e) {
        console.error('fetch 실패:', e);
      }
    };

    if (fileUrl) fetchData();
  }, [fileUrl]);

  const resetUITimer = () => {
    clearTimeout(uiTimeoutRef.current);
    setUiVisible(true);
    uiTimeoutRef.current = setTimeout(() => setUiVisible(false), 5000);
  };
  useEffect(() => {
    resetUITimer(); // 처음 5초 후 자동 숨김
  
    const handleUserInteraction = () => resetUITimer();
  
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
  
    return () => {
      clearTimeout(uiTimeoutRef.current);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);
  function useWindowSize() { // 동화책 크기 조절용 함수 
    const [size, setSize] = useState({ width: 640, height: 480 });
  
    useEffect(() => { 
      const updateSize = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
  
        // 기준 비율 유지 (예: 3:2 비율), 최소/최대 지정 가능
        const width = Math.max(315, Math.min(vw * 0.9, 1000));
        const height = Math.max(400, Math.min(vh * 0.8, 800));
        setSize({ width, height });
      };
  
      updateSize(); // 초기 실행
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, []);
  
    return size;
  }
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
  
    // 텍스트 페이지는 짝수 페이지 기준으로 오른쪽에 위치
    const textIndex = Math.floor(newPage / 2);
    if (newPage % 2 === 1 && texts[textIndex]) {
      speakText(texts[textIndex]);
    }
  };
  

  const toggleTTS = () => {
    if (isSpeaking) stopAudio();
    else speakText(texts[currentPage]);
  };

  if (!texts.length || !images.length) return <div style={{ padding: '2rem' }}>불러오는 중</div>;

  return (
    <Container>
      <OverlayTop style={{ display: uiVisible ? 'flex' : 'none' }}>
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
       width={Math.floor(width)}     // 숫자
       height={Math.floor(height)}   // 숫자
        size="fixed"
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
{texts.flatMap((text, idx) => {
  // 글자 수 기반 폰트 크기 계산
  const length = text.length;
  const baseSize = 1.6; // rem 단위
  let fontSize = `${baseSize}rem`;

  if (length > 600) fontSize = '0.85rem';
  else if (length > 500) fontSize = '1rem';
  else if (length > 400) fontSize = '1.1rem';
  else if (length > 300) fontSize = '1.2rem';
  else if (length > 200) fontSize = '1.4rem';

  return [
    <Page key={`img-${idx}`}>
      <PageContent>
        <PageImage src={images[idx]} alt={`img-${idx}`} />
      </PageContent>
    </Page>,

<Page key={`text-${idx}`}>
<PageText>
  <div
    style={{
      fontSize,
      lineHeight: 1.6,
      textAlign: 'center',
      width: '100%',
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
    }}
  >
    {text}
  </div>
</PageText>
</Page>

  ];
})}

        </HTMLFlipBook>
      </BookWrapper>
      <OverlayBottom style={{ display: uiVisible ? 'flex' : 'none' }}>
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
