import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';
import PopCard from '../components/PopCard';
import finishImg from '../assets/images/finish.png';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  background: #fff9ec;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  text-align: center;
`;

const PageImage = styled.img`
  max-width: 90%;
  max-height: 80%;
  object-fit: contain;
`;

const PageText = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export default function ReadingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileUrl = new URLSearchParams(location.search).get('file');

  const [title, setTitle] = useState('');
  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const [showFinishPopup, setShowFinishPopup] = useState(false);

  const bookRef = useRef();
  const audioRef = useRef();
  const currentPageRef = useRef(0);

  useEffect(() => {
    if (!fileUrl) return;

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

    fetchData();
  }, [fileUrl]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current.onended = null;
    }
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
          goNext();
        };
        await audioRef.current.play();
      }
    } catch (err) {
      console.error("TTS 오류:", err);
      goNext();
    }
  };

  const goNext = () => {
    const next = currentPageRef.current + 1;
    if (bookRef.current && next < images.length * 2) {
      bookRef.current.pageFlip().flipNext();
      currentPageRef.current = next;
    } else {
      setShowFinishPopup(true);
    }
  };

  const handleFlip = (e) => {
    const newPage = e.data;
    currentPageRef.current = newPage;

    const isTextPage = newPage % 2 === 1;
    const index = Math.floor(newPage / 2);

    if (isTextPage && texts[index]) {
      speakText(texts[index]);
    } else {
      setTimeout(() => {
        goNext();
      }, 3000);
    }
  };

  if (texts.length === 0 || images.length === 0) {
    return <div style={{ padding: '2rem' }}>불러오는 중...</div>;
  }

  return (
    <>
      <Container>
        <HTMLFlipBook
          width={600}
          height={500}
          showCover={false}
          flippingTime={900}
          mobileScrollSupport={true}
          onFlip={handleFlip}
          ref={bookRef}
        >
          {images.map((img, idx) => (
            <React.Fragment key={idx}>
              <Page><PageImage src={img} /></Page>
              <Page><PageText>{texts[idx]}</PageText></Page>
            </React.Fragment>
          ))}
        </HTMLFlipBook>
      </Container>

      {showFinishPopup && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
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
              currentPageRef.current = 0;
              bookRef.current.pageFlip().turnToPage(0);
            }}
            onNegativeClick={() => {
              stopAudio();
              navigate('/bookshelf');
            }}
          />
        </div>
      )}

      <audio ref={audioRef} hidden />
    </>
  );
}
