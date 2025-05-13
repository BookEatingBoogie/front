import React, { useState, useRef, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { storyInfoState } from '../recoil/atoms';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BsChevronLeft, BsVolumeUpFill } from 'react-icons/bs';
import PopCard from '../components/PopCard';
import finishImg from '../assets/images/finish.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
  position: relative;
  padding-bottom: 140px;

  @media (max-width: 480px) {
    padding-bottom: 100px;
  }
`;

const ImageWrapper = styled.div`
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 25.75rem;
  height: auto;
  object-fit: contain;

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const TextWrapper = styled.div`
  position: absolute;
  bottom: 120px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  padding: 1rem;
  z-index: 20;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.75rem;
  }
`;

const OverlayTop = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  background-color: #fff9ec;
  color: #1A202B;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
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
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #FFF9EC;
  padding: 0.75rem 1rem;
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  flex-direction: column;
  gap: 0.75rem;
  z-index: 10;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
`;

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const ProgressText = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #4A4A4A;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e6e6e6;
  border-radius: 3px;
  overflow: hidden;
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
  justify-content: space-between;
  align-items: center;
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

  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
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

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

export default function ReadingScreen() {
  const navigate = useNavigate();
  const stories = useRecoilValue(storyInfoState);
  const story = Array.isArray(stories) ? stories[0] : stories;

  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [showFinishPopup, setShowFinishPopup] = useState(false);
  const touchStartX = useRef(null);
  const autoStarted = useRef(false);
  const audioRef = useRef(null);

  const totalPages = story?.img?.length || 0;
  const progress = ((currentPage + 1) / totalPages) * 100;
  const texts = story.text || Array(totalPages).fill(story.summary);

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.removeAttribute('src'); 
      audioRef.current.load();
      audioRef.current.oncanplaythrough = null;
      audioRef.current.onended = null;
    }
    setIsSpeaking(false);
  };
  

  const speakText = async (text) => {
    try {
      stopSpeaking(); // 이전 재생 중단
  
      const res = await fetch("http://localhost:5001/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
  
      if (!res.ok) throw new Error("TTS 요청 실패");
  
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
  
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
  
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          if (autoPlay && currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
          } else if (currentPage === totalPages - 1) {
            setShowFinishPopup(true);
          }
        };
  
        await audioRef.current.play(); // 💡 바로 실행
        setIsSpeaking(true);
      }
    } catch (err) {
      console.error("TTS 오류:", err);
      setIsSpeaking(false);
    }
  };
  

  const toggleTTS = () => {
    if (isSpeaking) {
      stopSpeaking(); // ⏸ 누르면 완전 정지
    } else {
      setAutoPlay(true);
      speakText(texts[currentPage]); // ▶ 다시 읽기
    }
  };
  

  const handleNext = () => {
    stopSpeaking();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    stopSpeaking();
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (!autoStarted.current && texts[currentPage]) {
      speakText(texts[currentPage]);
      autoStarted.current = true;
    }
  }, [currentPage]);

  useEffect(() => {
    if (autoPlay && !isSpeaking && texts[currentPage]) {
      speakText(texts[currentPage]);
    }
  }, [currentPage, autoPlay, isSpeaking]);

  if (!story) return <div>불러오는 중...</div>;

  return (
    <Container
      onClick={() => setShowUI((prev) => !prev)}
      onTouchStart={(e) => (touchStartX.current = e.changedTouches[0].screenX)}
      onTouchEnd={(e) => {
        const deltaX = e.changedTouches[0].screenX - touchStartX.current;
        if (deltaX > 50) handlePrev();
        else if (deltaX < -50) handleNext();
      }}
    >
      <OverlayTop $visible={showUI}>
        <BackGroup>
          <BackIcon onClick={() => navigate(-1)} />
          <TopTitle>{story.title}</TopTitle>
        </BackGroup>
        <SoundButtonWrapper onClick={(e) => { e.stopPropagation(); toggleTTS(); }}>
          <SoundIcon />
        </SoundButtonWrapper>
      </OverlayTop>

      <ImageWrapper>
        <StyledImage src={story.img[currentPage]} alt={`페이지 ${currentPage + 1}`} />
      </ImageWrapper>

      <TextWrapper>{texts[currentPage]}</TextWrapper>

      <OverlayBottom $visible={showUI}>
        <ProgressInfo>
          <ProgressText>{currentPage + 1}/{totalPages}</ProgressText>
          <ProgressBarContainer>
            <Progress $progress={progress} />
          </ProgressBarContainer>
        </ProgressInfo>
        <NavButtons>
          <NavButton onClick={(e) => { e.stopPropagation(); handlePrev(); }}>◀ 이전 장으로</NavButton>
          <PlayButton onClick={(e) => { e.stopPropagation(); toggleTTS(); }}>
            {isSpeaking ? '⏸' : '▶'}
          </PlayButton>
          <NavButton onClick={(e) => { e.stopPropagation(); handleNext(); }}>다음 장으로 ▶</NavButton>
        </NavButtons>
      </OverlayBottom>

      {showFinishPopup && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
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
            subTitle={`[${story.title}] 이야기를`}
            description="끝까지 다 읽었어요!"
            positiveBtnText="다시 읽기"
            negativeBtnText="그만 읽기"
            onPositiveClick={() => {
              setShowFinishPopup(false);
              setCurrentPage(0);
              speakText(texts[0]);
              setAutoPlay(true);
            }}
            onNegativeClick={() => {
              setShowFinishPopup(false);
              stopSpeaking();
              navigate(-1);
            }}
          />
        </div>
      )}

      <audio ref={audioRef} hidden />
    </Container>
  );
}