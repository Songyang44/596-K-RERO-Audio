import React, { useState, useEffect } from "react";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(""); // 临时识别的文本
  const [editableTranscript, setEditableTranscript] = useState(""); // 用户编辑的文本

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPart = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        setEditableTranscript((prev) => prev + transcriptPart + " ");
        setTranscript("");
      } else {
        interimTranscript += transcriptPart;
      }
    }
    setTranscript(interimTranscript);
  };

  const startListening = () => {
    if (!isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      recognition.stop();
    };
  }, []);

  const handleTextChange = (e) => {
    setEditableTranscript(e.target.value);
  };

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>End Listening</button>
      <textarea
        value={editableTranscript + transcript}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default SpeechToText;
