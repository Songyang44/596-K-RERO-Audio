const express = require('express');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const client = new speech.SpeechClient();

app.post('/transcribe', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const audioBytes = fs.readFileSync(req.file.path).toString('base64');

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16', // 或您的音频文件的编码格式
      languageCode: 'en-US', // 或您的目标语言
      // 其他可选配置...
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    res.send({ transcribedText: transcription });
  } catch (error) {
    res.status(500).send(`Error during transcription: ${error}`);
  } finally {
    fs.unlinkSync(req.file.path); // 删除上传的文件
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
