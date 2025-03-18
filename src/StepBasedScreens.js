import React from 'react';
import { useRecoilValue } from 'recoil';
import { currentStepState } from './recoil/atoms';

// 기존 스크린들
import IntroScreen from './screens/IntroScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import QuestionScreen from './screens/QuestionScreen';
import ResultScreen from './screens/ResultScreen';

function StepBasedScreens() {
  const currentStep = useRecoilValue(currentStepState);

  switch (currentStep) {
    case 0:
      return <IntroScreen />;
    case 1:
      return <CharacterSelectScreen />;
    case 2:
      return <QuestionScreen />;
    case 3:
      return <ResultScreen />;
    case 4:
      return <QuestionScreen />;
    default:
      return <IntroScreen />;
  }
}

export default StepBasedScreens;