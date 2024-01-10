import React, { useState, useRef, useEffect } from "react";
import UploadFile from "../../store/uploadFile";
// import WaveSurfer from "wavesurfer.js";
// import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";

export default function Recording() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");
  const [storyData, setStoryData] = useState({
    audioBlob: null,
    description: "",
    coverImage: null,
  });
  // const inputFileRef=useRef();
  // const waveformRef = useRef(null);
  // const wavesurfer = useRef(null);
  // const microphone = useRef(null);

  // useEffect(() => {
  //   wavesurfer.current = WaveSurfer.create({
  //     container: waveformRef.current,
  //     waveColor: "violet",
  //     progressColor: "purple",
  //     plugins: [MicrophonePlugin.create()],
  //   });
  //   microphone.current = wavesurfer.microphone;
  //   return () => wavesurfer.destroy();
  // }, []);

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

    // if(navigator.mediaDevices){
    //   const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    //   wavesurfer.current.loadDecodedBuffer(stream);
    //   wavesurfer.current.play();
    // }
    // microphone.current.start();
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }

    // wavesurfer.current.stop();
    // microphone.current.stop();
  };

  const handleSaveRecording = () => {
    if (audioChunks.length === 0) {
      alert("No audio data recorded.");
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const audioElement = new Audio(audioUrl);
    audioElement.play();

    const newStoryData = {
      audioBlob,
      description,
      coverImage,
    };

    setStoryData(newStoryData);

    // To save the audio file,  create a download link.
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "recorded-audio.wav";
    a.click();
  };

  const handleSelectImage = () => {
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
      {/* <button>Upload Story</button> */}
      {/* <div id="waveform" ref={waveformRef}></div> */}
      <UploadFile storyData={storyData} />
    </div>
  );
}
