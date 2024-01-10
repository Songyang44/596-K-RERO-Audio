import React, { useRef, useEffect, useState } from "react";

const AudioVisualizer = ({ audioFile }) => {
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [source, setSource] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);
  const [progress, setProgress] = useState(0);

  // 初始化 AudioContext
  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  // 加载音频文件
  useEffect(() => {
    if (audioContext) {
      const loadAudio = async () => {
        const response = await fetch(audioFile);
        const arrayBuffer = await response.arrayBuffer();
        const newAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(newAudioBuffer);
      };
      loadAudio();
    }
  }, [audioContext, audioFile]);

  // 切换播放状态
  const togglePlayPause = () => {
    if (!audioContext || !audioBuffer) return;

    if (playing) {
      // 暂停
      const elapsedTime = audioContext.currentTime - startTime;
      setPauseTime(elapsedTime);
      source.stop();
      setPlaying(false);
    } else {
      // 播放
      const newSource = audioContext.createBufferSource();
      newSource.buffer = audioBuffer;
      const newAnalyser = audioContext.createAnalyser();
      newSource.connect(newAnalyser);
      newAnalyser.connect(audioContext.destination);
      newSource.start(0, pauseTime);
      setSource(newSource);
      setAnalyser(newAnalyser);
      setStartTime(audioContext.currentTime - pauseTime);
      setPlaying(true);
    }
  };

  // 绘制音频波形
  useEffect(() => {
    if (!analyser || !playing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  }, [analyser, playing]);

  // 更新进度条
  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        const elapsedTime = audioContext.currentTime - startTime;
        const duration = audioBuffer.duration;
        setProgress((elapsedTime / duration) * 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [playing, audioContext, startTime, audioBuffer]);

  return (
    <div>
      <button onClick={togglePlayPause}>{playing ? "Pause" : "Play"}</button>
      <progress value={progress} max="100" />
      <canvas ref={canvasRef} width="600" height="400" />
    </div>
  );
};

export default AudioVisualizer;
