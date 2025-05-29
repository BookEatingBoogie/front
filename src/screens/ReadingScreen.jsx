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
  background: #fefcf9 url('https://www.transparenttextures.com/patterns/paper-fibers.png');
  background-size: auto;
  background-repeat: repeat;
  border-radius: 8px;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.03),
    0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 1.2rem;
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

const [autoPlay, setAutoPlay] = useState(true);

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

  useEffect(() => {
    if (texts.length && images.length && currentPage === 0) {
      const textIndex = 0;
      if (autoPlay && texts[textIndex]) {
        console.log(currentPage)
        console.log('[DEBUG] 초기 speakText 호출 시도');
        speakText(texts[textIndex], textIndex);
      }
    }
  }, [texts, images]);
  

  
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
  function useWindowSize() {
    const [size, setSize] = useState({ width: 1200, height: 900 }); // 기본 4:3
  
    useEffect(() => {
      const updateSize = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
  
        // 최대한 꽉 차게 만들되, 4:3 비율 유지
        const margin = 64; // 상하단 여유
        const maxWidth = vw * 0.98;
        const maxHeight = vh - margin;
  
        const width = Math.min(maxWidth, maxHeight * (4 / 3));
        const height = width * (3 / 4);
  
        setSize({ width, height });
      };
  
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, []);
  
    return size;
  }
  
  
  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      audio.onended = null;
    }
    setIsSpeaking(false);
  };
  
// 문장 단위 분할
const splitText = (text) =>
  text ? text.match(/[^\.!\?]+[\.!\?]+/g)?.map(s => s.trim()) || [text] : [];

// TTS 요청
const ttsFetch = async (chunk) => {
  console.log('[TTS 요청 시작]', chunk);

  try {
    const res = await fetch('http://localhost:5001/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chunk }),
    });

    if (!res.ok) {
      console.error('[TTS 요청 실패] 상태코드:', res.status);
      throw new Error('TTS 요청 실패');
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    console.log('[TTS 응답 성공] Blob URL:', url);
    return url;
  } catch (err) {
    console.error('[TTS 요청 에러]', err);
    throw err;
  }
};


// 문장별로 순차 재생 (미리 다음 문장 fetch)
const playChunks = async (chunks) => {
  let preFetchedUrl = null;

  for (let i = 0; i < chunks.length; i++) {
    const url = i === 0 ? await ttsFetch(chunks[i]) : preFetchedUrl;

    let nextPromise = null;
    if (i + 1 < chunks.length) {
      nextPromise = ttsFetch(chunks[i + 1]);
    }

    const audio = new Audio(url); 
    audioRef.current = audio;

    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.play().catch((err) => {
        console.error('TTS 재생 실패:', err);
        resolve();
      });
    });

    URL.revokeObjectURL(url);
    if (nextPromise) {
      preFetchedUrl = await nextPromise;
    }
  }
};



const speakText = async (text, pageIndex) => {
  console.log('[speakText 호출]', { text, pageIndex });
  stopAudio();

  if (!text) {
    console.warn('[speakText] 텍스트 없음, 실행 중단');
    return;
  }

  try {
    const chunks = splitText(text);
    console.log('[분할된 문장]', chunks);

    setIsSpeaking(true);
    await playChunks(chunks);
    setIsSpeaking(false);

    const isLast = pageIndex >= texts.length - 1;
    if (autoPlay && !isLast) {
      const flipAPI = bookRef.current?.pageFlip?.();
      flipAPI?.flip?.((pageIndex + 1) * 2);
    } else if (autoPlay && isLast) {
      setShowFinishPopup(true);
    }
  } catch (err) {
    console.error('[speakText 오류]', err);
    setIsSpeaking(false);
  }
};



const handleFlip = (e) => {
  const newPage = e.data;
  setCurrentPage(newPage);

  // 텍스트가 있는 페이지(짝수 번호)일 때만
  if (autoPlay && newPage % 2 === 0) {
    const textIndex = newPage / 2;

    if (texts[textIndex]) {
      console.log('[DEBUG] 페이지 이동 → TTS 시작: textIndex =', textIndex);
      speakText(texts[textIndex], textIndex);
    } else {
      console.warn('[DEBUG] 해당 인덱스에 텍스트 없음:', textIndex);
    }
  }
};




const toggleTTS = () => {
  if (isSpeaking) stopAudio();
  else {
    const textIndex = Math.floor(currentPage / 2);
    if (texts[textIndex]) {
      speakText(texts[textIndex], textIndex);
    } else {
      console.warn('[TTS] toggleTTS: 유효하지 않은 textIndex입니다:', textIndex);
    }
  }
};

  

  if (!texts.length || !images.length) return <div style={{ padding: '2rem' }}>불러오는 중</div>;

  return (
    <Container>
      <OverlayTop style={{ opacity: uiVisible ? 1 : 0, pointerEvents: uiVisible ? 'auto' : 'none' }}>
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
        style={{
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
>
{
texts.flatMap((text, idx) => {
  const length = text.length;
  let fontSize = '1.7rem';
  if (length > 600) fontSize = '0.8rem';
  else if (length > 500) fontSize = '1rem';
  else if (length > 400) fontSize = '1.3rem';
  else if (length > 300) fontSize = '1.5rem';

  return [
    <Page key={`img-${idx}`}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '2rem'
      }}>
        <img
          src={images[idx]}
          alt={`img-${idx}`}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '90%',
            maxWidth: '90%',
            objectFit: 'contain',
            borderRadius: '1.5rem'
          }}
        />
      </div>
    </Page>,

    <Page key={`text-${idx}`}>
      <PageText>
        <div style={{
          fontSize,
          lineHeight: 1.6,
          textAlign: 'center',
          width: '100%',
          padding: "0.5rem",
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all'
        }}>
          {text}
        </div>
      </PageText>
    </Page>
  ];
})}


        </HTMLFlipBook>
      </BookWrapper>
      <OverlayBottom style={{ opacity: uiVisible ? 1 : 0, pointerEvents: uiVisible ? 'auto' : 'none' }}>

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
              bookRef.current.pageFlip().flip(0); 
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
