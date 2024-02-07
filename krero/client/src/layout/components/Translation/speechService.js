// src/services/speechService.js

import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export const transcribeAudio = async (
  subscriptionKey,
  serviceRegion,
  language,
  onTranscription,
  onError
) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
  speechConfig.speechRecognitionLanguage = language;

  const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = (s, e) => {
    onTranscription(e.result.text, false);
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      onTranscription(e.result.text, true);
    }
  };

  recognizer.startContinuousRecognitionAsync(
    () => {
      console.log("Recognition started");
    },
    (err) => {
      console.error("Error starting recognition:", err);
      onError(err);
    }
  );

  return recognizer; // Return the recognizer so it can be stopped from the component
};
