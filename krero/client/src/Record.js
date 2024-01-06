import React, { useState } from "react";

export default function Recording() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      console.log("Audio stream", stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.onstop = () => {
        setMediaRecorder(null);
        setRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleSaveRecording = () => {
    if (audioChunks.length === 0) {
      alert("No audio data recorded.");
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    // You can do something with the audio data or display it as an audio element.
    // For example:
    // const audioElement = new Audio(audioUrl);
    // audioElement.play();

    // To save the audio file, you can create a download link.
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "recorded-audio.wav";
    a.click();
  };

  const handleSelectImage = () => {
    // 模拟点击文件输入元素
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setCoverImage(selectedImage);
    }
  };

  const inputFileRef = React.createRef();

  return (
    <div>
      <button onClick={handleStartRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={handleStopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <button onClick={handleSaveRecording}>Save Recording</button>
      <br />
      {coverImage && (
        <div>
          <img
            src={URL.createObjectURL(coverImage)}
            alt="Selected Image"
            style={{ maxWidth: "100px", maxHeight: "100px" }} // 调整图片显示大小
          />
        </div>
      )}
      <br />
      <textarea
        placeholder="Enter a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputFileRef} // 将文件输入元素与引用关联
        style={{ display: "none" }} // 隐藏文件输入元素
      />
      <button onClick={handleSelectImage}>Select Image</button>
      <button>Upload Story</button>
    </div>
  );
}
