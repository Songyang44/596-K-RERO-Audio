import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const EditorofAudio = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const audioContext = useRef(new AudioContext());
  const currentSource = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        height: 100,
        responsive: true,
      });

      wavesurfer.current.on("audioprocess", () => {
        if (wavesurfer.current) {
          setPlaybackProgress(
            wavesurfer.current.getCurrentTime() /
              wavesurfer.current.getDuration()
          );
        }
      });
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      wavesurfer.current.load(url);

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedAudio = await audioContext.current.decodeAudioData(
        arrayBuffer
      );
      setAudioBuffer(decodedAudio);
    }
  };

  const playPause = () => {
    wavesurfer.current.playPause();
  };

  const playSelectedPart = () => {
    if (!audioBuffer) return;

    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }

    if (currentSource.current) {
      currentSource.current.stop();
      currentSource.current.disconnect();
    }

    const source = audioContext.current.createBufferSource();
    currentSource.current = source;

    // const startTime = Math.max(0, start);
    // const endTime = Math.min(end, audioBuffer.duration);
    const startTime = Math.max(0, parseFloat(start));
    const endTime = Math.min(parseFloat(end), audioBuffer.duration);
    if (startTime >= endTime) {
      console.error("Invalid start/end time");
      return;
    }
    const duration = Math.max(0, endTime - startTime);

    const newBuffer = audioContext.current.createBuffer(
      audioBuffer.numberOfChannels,
      audioContext.current.sampleRate * duration,
      audioContext.current.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const newChannelData = newBuffer.getChannelData(channel);
      const originalChannelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < newChannelData.length; i++) {
        newChannelData[i] =
          originalChannelData[
            i + Math.floor(startTime * audioBuffer.sampleRate)
          ];
      }
    }

    source.buffer = newBuffer;
    source.connect(audioContext.current.destination);
    source.start(0);

    source.onended = () => {
      source.disconnect();
      currentSource.current = null;
    };
    setIsPlaying(true);
    source.onended = () => {
      source.disconnect();
      currentSource.current = null;
      setIsPlaying(false);
    };
  };

  const stopPlaying = () => {
    if (currentSource.current) {
      currentSource.current.stop();
      currentSource.current.disconnect();
      currentSource.current = null;
      setIsPlaying(false);
    }
  };

  const resetSelection = () => {
    setStart(0);
    setEnd(0);
  };

  const handleFileButtonClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  return (
    <div>
      <button onClick={handleFileButtonClick}>Choose Audio</button>
      <input
        id="hiddenFileInput"
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ display: "none", margin: "10px 0" }}
      />
      <div id="waveform" ref={waveformRef}></div>
      <button onClick={playPause}>Play/Pause</button>
      <div style={{ marginTop: "10px" }}>
        <input
          type="number"
          value={start}
          onChange={(e) => setStart(parseFloat(e.target.value))}
          placeholder="Start Time (s)"
        />
        <input
          type="number"
          value={end}
          onChange={(e) => setEnd(parseFloat(e.target.value))}
          placeholder="End Time (s)"
        />
        <button onClick={playSelectedPart} disabled={isPlaying}>
          Play Selected Part
        </button>
        <button onClick={stopPlaying} disabled={!isPlaying}>
          Stop Playing
        </button>
        <button onClick={resetSelection}>Reset Selection</button>
      </div>
      <progress
        value={playbackProgress}
        max="1"
        style={{ width: "100%" }}
      ></progress>
    </div>
  );
};

export default EditorofAudio;
