import React, { useEffect, useState, useRef, useContext } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { getSolidDataset, getThing, getUrlAll } from "@inrupt/solid-client";
import { getOrCreateNewPost } from "../../../utils/index";
//import PostList from "../PostList/PostList";
import { PostContext } from "../PostContext/PostContext";
import "../AddPost/index.css";

function AddPost() {
  const { session } = useSession();
  const [todoList, setTodoList] = useState();
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [pod, setPod] = useState(""); // State to store the pod URL
  const [createdFolderUri, setCreatedFolderUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [speechRecognitionResult, setSpeechRecognitionResult] = useState("");
  const [speechRecognizer, setSpeechRecognizer] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const [countdown, setCountdown] = useState(null);

  const [postUrl, setPostUrl] = useState("");

  const { setPost } = useContext(PostContext);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const profileDataset = await getSolidDataset(session.info.webId, {
        fetch: session.fetch,
      });
      const profileThing = getThing(profileDataset, session.info.webId);
      const podsUrls = getUrlAll(
        profileThing,
        "http://www.w3.org/ns/pim/space#storage"
      );
      if (podsUrls.length > 0) {
        setPod(podsUrls[0]); // Set the first pod URL
      }
    })();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.lang = "en-US";
      recognizer.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            setSpeechRecognitionResult(
              (prev) => prev + event.results[i][0].transcript
            );
          }
        }
      };
      setSpeechRecognizer(recognizer);
      setPost({
        postUrl: pod,
        postName: inputText.trim(),
      });
    } else {
      console.error("浏览器不支持语音识别。");
    }

    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setRecordedAudioUrl(url);
    }

    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [session, audioBlob]);

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const startCountdown = () => {
    let timeLeft = 3; // countdown
    setCountdown(timeLeft);

    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        setCountdown(null);
        startRecording(); // start record when countdown finish
      }
    }, 1000); // refresh every 1 s
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !MediaRecorder) {
      alert("The recording feature is not available in your browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        setAudioBlob(event.data);
        setAudioFile(
          new File([event.data], "recording.mp3", { type: "audio/mp3" })
        );
      };

      recorder.start();
      setIsRecording(true);
      draw();
    } catch (err) {
      console.error("Recording startup failed:", err);
    }

    speechRecognizer && speechRecognizer.start();
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);

    mediaRecorder.onstop = () => {
      const audioFile = new File([audioBlob], "recording.mp3", {
        type: "audio/mpeg",
      });
      setRecordedAudio(audioFile);
    };
    speechRecognizer && speechRecognizer.stop();
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgb(200, 200, 200)";
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

    renderFrame();
  };
  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    const containerUri = `${pod}Kōrero on the Couch/Posts/${inputText.trim()}/`;
    const list = await getOrCreateNewPost(
      containerUri,
      session.fetch,
      recordedAudio,
      imageFile,
      speechRecognitionResult
    );

    setTodoList(list);
    setShowInput(false); // Optionally hide the input box after submission
    setInputText("");
    setSpeechRecognitionResult(""); // Clear the input text
    setPostUrl(containerUri);

    if (list) {
      // Assuming 'list' indicates a successful folder creation
      setCreatedFolderUri(containerUri);
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setImageFile(null);
    setInputText("");
    setSpeechRecognitionResult("");
    setAudioBlob(null);
    setRecordedAudio(null);
  };

  const handleImageUploadClick = () => {
    document.getElementById("image-upload").click();
  };

  const cancelRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
    setAudioBlob(null);
    setAudioFile(null);
    speechRecognizer && speechRecognizer.stop();
    // Reset any other states as necessary
  };

  const handleBackButtonClick = () => {
    setShowInput(false);
    // Reset any other states as necessary
    setInputText("");
    setAudioFile(null);
    setImageFile(null);
    setSpeechRecognitionResult("");
    // ... other state resets as needed ...
  };

  const downloadRecording = () => {
    const link = document.createElement("a");
    link.href = recordedAudioUrl;
    link.download = "recording.mp3";
    document.body.appendChild(link); // Append to html
    link.click();
    document.body.removeChild(link); // Remove after download
  };

  const renderAudioPlayer = () => {
    if (!recordedAudioUrl) return null;

    return (
      <div>
        <audio controls src={recordedAudioUrl}></audio>
        <button onClick={downloadRecording}>Download Recording</button>
      </div>
    );
  };

  return (
    <div className="add-post-container">
      {showInput ? (
        <div>
          <button className="back-button" onClick={handleBackButtonClick}>
            Back to Add Post
          </button>
          {isRecording && (
            <div>
              <button className="record-button" onClick={stopRecording}>
                Stop Recording
              </button>
              <button className="cancel-button" onClick={cancelRecording}>
                Cancel
              </button>
            </div>
          )}
          {!isRecording && countdown == null && (
            <button className="start-record-button" onClick={startCountdown}>
              Start Recording
            </button>
          )}

          {audioBlob && <p>Recoed finished</p>}
          <input
            className="text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter folder name"
          />

          <button
            className="image-upload-button"
            onClick={handleImageUploadClick}
          >
            Upload Image
          </button>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="image-upload"
          />
          <textarea
            className="textarea-input"
            value={speechRecognitionResult}
            onChange={(e) => setSpeechRecognitionResult(e.target.value)}
            placeholder="Speech to Text"
          />
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <div className="canvas-container">
            <canvas ref={canvasRef} width="600" height="100"></canvas>
          </div>
          {renderAudioPlayer()}

          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>

          {/* <PostList createdFolderUri={createdFolderUri} /> */}
          {/* <DisplayPost postUrl={pod} postName={inputText.trim()}/> */}
        </div>
      ) : (
        <>
          <button className="add-post-button" onClick={handleButtonClick}>
            Add New Story
          </button>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </>
      )}
      {audioFile && <p>Audio Uploaded: {audioFile.name}</p>}
      {speechRecognitionResult && (
        <p>Story Content: {speechRecognitionResult}</p>
      )}
      {imageFile && (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(imageFile)}
            alt={imageFile.name}
            style={{ width: "100px", height: "100px" }}
          />
          <p>{imageFile.name}</p>
        </div>
      )}
    </div>
  );
}

export default AddPost;
