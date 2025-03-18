import React from 'react';
import { Routes, Route} from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import ConfirmCharacterScreen from './screens/ConfirmCharacterScreen';
import QuestionScreen from './screens/QuestionScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import ResultScreen from './screens/ResultScreen';
import ConfirmInfoScreen from './screens/ConfirmInfoScreen';

// Recoil 단계 분기 스크린
import StepBasedScreens from './StepBasedScreens';

// 새로 만든 화면들
import StorageScreen from './screens/StorageScreen';
import SettingsScreen from './screens/SettingsScreen';

// 하단 고정 바
import BottomNav from './components/BottomNav';

function App() {
  return (
    <>
      <GlobalStyle />

      {/* 라우트 설정 */}
      <Routes>
        <Route path="/" element={<StepBasedScreens />} />
        <Route path="/create-character" element={<CharacterCreationScreen />} />
        <Route path="/bookshelve" element={<StorageScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/question/character" element={<QuestionScreen questionType="character" />} />
        <Route path="/question/story" element={<QuestionScreen questionType="story" />} />
        <Route path="/confirm" element={<ConfirmCharacterScreen />} />
        <Route path='/character-select' element={<CharacterSelectScreen />} />
        <Route path='/result' element={<ResultScreen />} />
        <Route path='/confirm-info' element={<ConfirmInfoScreen />} />
        {/*<Route path="/favorites" element={<FavoritesScreen />} />*/}
        {/*<Route path="/character-storage" element={<CharacterSelectScreen />} /> 애네둘 위에 임포트도 넣어야함함*/}
      </Routes>

      {/* 모든 페이지에서 하단 고정 바 표시 */}
      {<BottomNav />}
    </>
  );
}

export default App;