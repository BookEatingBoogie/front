import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import GlobalStyle from './styles/GlobalStyle';
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import ConfirmCharacterScreen from './screens/ConfirmCharacterScreen';
import CharacterQuestionScreen from './screens/CharacterQuestionScreen.jsx';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import ResultScreen from './screens/ResultScreen';
import ConfirmInfoScreen from './screens/ConfirmInfoScreen';
import ConfirmStoryScreen from './screens/ConfirmStoryScreen';
import LoadingScreen from './screens/LoadingScreen';
import IntroScreen from './screens/IntroScreen';
import StorageScreen from './screens/StorageScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import StoryQuestionScreen from './screens/StoryQuestionScreen.jsx';

// 하단 고정 바
import BottomNav from './components/BottomNav';

function App() {
  const location = useLocation();

  // 네비게이션 바 표시 여부를 결정
  // 네비바가 뜨길 원하면 아래처럼 작성
  const showNav =
    location.pathname === '/' ||
    location.pathname === '/book-storage' ||
    location.pathname === '/settings' ||
    location.pathname === '/favorites' ||
    location.pathname === '/character-storage';
  
  return (
    <RecoilRoot>
      <GlobalStyle />

      {/* 라우트 설정 */}
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/" element={<IntroScreen />} />
        <Route path="/create-character" element={<CharacterCreationScreen />} />
        <Route path="/book-storage" element={<StorageScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/character-question" element={<CharacterQuestionScreen />} />
        <Route path="/story-question" element={<StoryQuestionScreen />} />
        <Route path="/confirm" element={<ConfirmCharacterScreen />} />
        <Route path='/character-select' element={<CharacterSelectScreen />} />
        <Route path='/result' element={<ResultScreen />} />
        <Route path='/confirm-info' element={<ConfirmInfoScreen />} />
        <Route path="/confirm-story" element={<ConfirmStoryScreen />} />
        <Route path="/loading" element={<LoadingScreen />} />
        {/*<Route path="/favorites" element={<FavoritesScreen />} />*/}
        {/*<Route path="/character-storage" element={<CharacterSelectScreen />} /> 애네둘 위에 임포트도 넣어야함함*/}
      </Routes>

      {/* 모든 페이지에서 하단 고정 바 표시 */}
      {showNav && <BottomNav />}
    </RecoilRoot>
  );
}

export default App;