import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import "../Editor/Editor.css";

const AudioEditor = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [playStart, setPlayStart] = useState(null);
  const [playEnd, setPlayEnd] = useState(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const fileInputRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const formatTime = (time) => {
    const roundedTime = Math.round(time);
    const minutes = Math.floor(roundedTime / 60);
    const seconds = roundedTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  //  choose file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  // play/pause switch
  const togglePlayback = () => {
    if (wavesurfer.current) {
      const currentlyPlaying = wavesurfer.current.isPlaying();
      if (currentlyPlaying) {
        wavesurfer.current.pause();
        setIsPlaying(false);
      } else {
        wavesurfer.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (wavesurfer.current && waveformRef.current) {
      const bbox = waveformRef.current.getBoundingClientRect();
      const duration = wavesurfer.current.getDuration();
      const x = event.clientX - bbox.left;
      const progress = x / bbox.width;
      const time = duration * progress;
      setHoverTime(time);
    }
  };

  // init wavesurfer
  const initWaveSurfer = () => {
    if (waveformRef.current && audioFile) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        plugins: [RegionsPlugin.create()],
      });

      wavesurfer.current.load(URL.createObjectURL(audioFile));

      wavesurfer.current.on("audioprocess", () => {
        const currentTime = wavesurfer.current.getCurrentTime();
        setCurrentTime(currentTime);

        if (
          playStart !== null &&
          playEnd !== null &&
          currentTime >= playStart &&
          currentTime < playEnd
        ) {
          wavesurfer.current.setCurrentTime(playEnd);
        }
      });

      wavesurfer.current.on("seek", () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });
    }
  };

  useEffect(() => {
    initWaveSurfer();

    const waveformContainer = waveformRef.current;
    waveformContainer &&
      waveformContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      waveformContainer &&
        waveformContainer.removeEventListener("mousemove", handleMouseMove);
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioFile]);
  useEffect(() => {
    if (wavesurfer.current) {
      const updatePlayback = () => {
        const currentTime = wavesurfer.current.getCurrentTime();

        if (
          playStart !== null &&
          playEnd !== null &&
          currentTime >= playStart &&
          currentTime < playEnd
        ) {
          wavesurfer.current.setCurrentTime(playEnd);
        }
      };

      wavesurfer.current.on("audioprocess", updatePlayback);

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.un("audioprocess", updatePlayback);
        }
      };
    }
  }, [playStart, playEnd]);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const resetAudio = () => {
    setAudioFile(null);
    setAudioUrl(null);
    setPlayStart(null);
    setPlayEnd(null);
    setHoverTime(null);
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
      wavesurfer.current = null;
    }
  };

  return (
    <div className="container">
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="fileInput"
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button className="button" onClick={handleFileInputClick}>
        Upload Audio File
      </button>
      <button className="button" onClick={togglePlayback}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      {audioUrl && (
        <>
          <a href={audioUrl} download>
            <button className="button">Download Audio File</button>
          </a>
          <button className="button" onClick={resetAudio}>
            Reset
          </button>
        </>
      )}
      <div className="waveformContainer" ref={waveformRef}></div>
      <div className="controls">
        <div className="time">
          <span>
            {formatTime(currentTime)} /{" "}
            {formatTime(wavesurfer.current?.getDuration())}
          </span>
        </div>
        <input
          className="slider"
          type="range"
          min="0"
          max={wavesurfer.current?.getDuration() || 0}
          value={currentTime}
          onChange={(e) =>
            wavesurfer.current?.seekTo(
              e.target.value / wavesurfer.current.getDuration()
            )
          }
        />
      </div>
      <div className="hoverTime">Hover Time: {formatTime(hoverTime)}</div>
      <div>
        <input
          type="number"
          placeholder="Skip Start (s)"
          value={playStart || ""}
          onChange={(e) => setPlayStart(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Skip End (s)"
          value={playEnd || ""}
          onChange={(e) => setPlayEnd(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default AudioEditor;
