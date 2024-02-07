import React, { useState, useEffect } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const subscriptionKey = "f38b8450e1784a16a43178393ae7a058";
  const serviceRegion = "australiaeast";
  const translatorKey = "68f53d825063400d8087a930b1d04d5e"; // Your Translator Key
  const translatorLocation = "australiaeast"; // Your Translator Resource Location
  const translatorEndpoint =
    "https://australiaeast.api.cognitive.microsoft.com/"; // Translator Endpoint

  let speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  let recognizer;

  const translateText = async (text) => {
    let params = new URLSearchParams();
    params.append("api-version", "3.0");
    params.append("from", "en");
    params.append("to", "sw");
    params.append("to", "it");

    try {
      const response = await axios({
        baseURL: translatorEndpoint,
        url: "/translate",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": translatorKey,
          "Ocp-Apim-Subscription-Region": translatorLocation,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        params: params,
        data: [{ text: text }],
        responseType: "json",
      });

      setTranslatedText(JSON.stringify(response.data, null, 4));
    } catch (error) {
      console.error("Error in translation:", error);
    }
  };

  const startListening = () => {
    if (!isListening) {
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizing = (s, e) => {
        setTranscript(e.result.text);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          const finalText = e.result.text;
          setEditableTranscript((prev) => prev + finalText + " ");
          translateText(finalText); // Translate the recognized text
          setTranscript("");
        }
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          setIsListening(true);
          console.log("Recognition started");
        },
        (err) => {
          console.error("Error starting recognition:", err);
          recognizer.close();
          recognizer = undefined;
        }
      );
    }
  };

  const stopListening = () => {
    if (isListening && recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          setIsListening(false);
          console.log("Recognition stopped");
        },
        (err) => {
          console.error("Error stopping recognition:", err);
          recognizer.close();
          recognizer = undefined;
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (recognizer) {
        recognizer.close();
        recognizer = undefined;
      }
    };
  }, []);

  const handleTextChange = (e) => {
    setEditableTranscript(e.target.value);
  };

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <textarea
        value={editableTranscript + transcript}
        onChange={handleTextChange}
        placeholder="You will see transcription here..."
      />
      <div>
        <h2>Translated Text</h2>
        <p>{translatedText}</p>
      </div>
    </div>
  );
};

export default SpeechToText;
