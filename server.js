const express = require('express');
const multer = require('multer');
const cors = require('cors'); // 1단계에서 설치한 cors 모듈 불러오기
const { SpeechClient } = require('@google-cloud/speech');

const app = express();
const port = process.env.PORT || 3001;
const upload = multer();

// CORS 미들웨어 추가 (모든 도메인 허용)
app.use(cors());

// Google Cloud Speech 클라이언트 생성
const speechClient = new SpeechClient();

app.post('/api/google-stt', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '오디오 파일이 제공되지 않았습니다.' });
  }

  const audioBytes = req.file.buffer.toString('base64');
  const audio = { content: audioBytes };

  // 여기에 실제 오디오 파일의 인코딩 및 sampleRateHertz를 맞춰주세요.
  const config = {
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: 'ko-KR',
  };

  const request = { audio, config };

  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log('전사 결과:', transcription);
    res.json({ transcript: transcription });
  } catch (error) {
    console.error('Speech-to-Text 처리 중 오류:', error);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});