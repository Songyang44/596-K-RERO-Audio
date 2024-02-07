import React, { useState } from "react";
import axios from "axios";
import "../Translation/Translation.css";

export default function Translation() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const translateText = async () => {
    try {
      const response = await axios.post(
        "YOUR-BACKEND-PORT",
        {},
        {
          params: {
            q: text,
            target: "mi",
            key: "YOUR_API_KEY",
          },
        }
      );
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error("Error during translation", error);
    }
  };

  const clearText = () => {
    setTranslatedText("");
  };

  return (
    <div className="translation-container">
      <h2>Text Translator</h2>
      <textarea
        className="input-text"
        placeholder="Enter text to translate"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="translate-button" onClick={translateText}>
        Translate
      </button>{" "}
      <button className="clear-button" onClick={clearText}>
        Clear Text
      </button>
      <div className="translated-text">
        <p>Translated Text:</p>

        <textarea value={translatedText}></textarea>
      </div>
    </div>
  );
}
