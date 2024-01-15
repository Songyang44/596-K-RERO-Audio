import React, { useState, useRef, useEffect } from "react";
import UploadFile from "../../store/uploadFile";
import { translateText } from "../../layout/translator/translate";
import Post from "../post/post";

const CombineofAudioRecorderandSpeech = ({ onUpload, onAddPost }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const fileInputRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [editableTranscript, setEditableTranscript] = useState("");

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

  // 开始录音
  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioUrl(URL.createObjectURL(event.data));
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      draw();
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
    window.cancelAnimationFrame(animationRef.current);
  };

  // 绘制波形
  const draw = () => {
    if (!analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
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
    animationRef.current = requestAnimationFrame(draw);
  };

  const resetRecording = () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop(); // 停止录音
      window.cancelAnimationFrame(animationRef.current); // 停止绘制波形
    }
    setIsRecording(false);
    setAudioUrl(""); // 清除录音 URL
    // 这里可以添加任何其他需要重置的状态或数据
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    }
    setImage(null);
    setImageUrl("");
    setImageName("");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTranscript("");
    setEditableTranscript("");
  };

  useEffect(() => {
    return () => {
      recognition.stop();
    };
  }, []);

  const handleTextChange = (e) => {
    setEditableTranscript(e.target.value);
    adjustTextareaHeight(e.target);
  };
  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto"; // 先重置高度
    textarea.style.height = textarea.scrollHeight + "px"; // 然后设置为滚动高度
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const [shouldUpload, setShouldUpload] = useState(false);

  const handleUploadClick = () => {
    setShouldUpload(true);
    if (onUpload) {
      onUpload({ audioUrl, imageUrl, editableTranscript });
    } // 调用传递进来的函数
  };

  // const [showPost, setShowPost] = useState(false);
  // const createPost = () => {
  //   if (audioUrl || imageUrl || editableTranscript) {
  //     setShowPost(true);
  //   } else {
  //     alert("没有足够的内容来创建帖子。");
  //   }
  // };

  const handleCreatePost = () => {
    const newPost = {
      audioUrl: audioUrl,
      imageUrl: imageUrl,
      editableTranscript: editableTranscript,
    };
    onAddPost(newPost);
    alert("Create successfully");
  };
  const handleTranslate = async () => {
    const translated = await translateText(editableTranscript);
    setEditableTranscript(translated);
  };

  // 触发文件选择
  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {/* <button onClick={resetRecording}>Reset Recording</button>{" "} */}
      <button onClick={triggerFileSelect}>Upload Image</button>{" "}
      {/* 自定义的上传图片按钮 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />{" "}
      {/* 隐藏的文件输入控件 */}
      {/* {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Cover"
            style={{ width: "100px", height: "100px" }}
          />
          <p>{imageName}</p>
        </div>
      )} */}
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>End Listening</button>
      <button onClick={resetRecording}>Reset</button> {/* 新增的重置按钮 */}
      <textarea
        style={{
          width: "100%", // 使文本域占据整个屏幕宽度
          minHeight: "100px", // 设置一个最小高度
          // 可选，防止用户手动调整大小
        }}
        value={editableTranscript + transcript}
        onChange={handleTextChange}
      />
      {/* <textarea
        value={editableTranscript}
        onChange={(e) => setEditableTranscript(e.target.value)}
      /> */}
      <button onClick={handleTranslate}>Translate to Māori</button>
      <button onClick={handleUploadClick}>Upload Data</button>
      {shouldUpload && (
        <UploadFile
          audioUrl={audioUrl}
          imageUrl={imageUrl}
          editableTranscript={editableTranscript}
        />
      )}
      <button onClick={handleCreatePost}>Create Post</button>
      {/* <button onClick={createPost}>Create Post</button>
      {showPost && (
        <Post
          audioUrl={audioUrl}
          imageUrl={imageUrl}
          editableTranscript={editableTranscript}
        />
      )} */}
      <canvas ref={canvasRef} width="600" height="100"></canvas>
      {audioUrl && (
        <audio src={audioUrl} controls>
          Your browser does not support the audio element.
        </audio>
      )}
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Cover"
            style={{ width: "100px", height: "100px" }}
          />
          <p>{imageName}</p>
        </div>
      )}
    </div>
  );
};

export default CombineofAudioRecorderandSpeech;
