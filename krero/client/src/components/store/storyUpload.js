import React, { useState } from "react";
import Recording from "../layout/record/Record"; // 路径按实际情况调整
import ChooseFileToUpload from "../layout/choose/chooseFile"; // 路径按实际情况调整
import UploadFile from "../store/uploadFile"; // 路径按实际情况调整

export default function StoryUploader() {
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState("");

  const storyData = {
    audioFile,
    coverImage,
    description,
  };

  return (
    <div>
      <Recording
        setAudioFile={setAudioFile}
        setCoverImage={setCoverImage}
        setDescription={setDescription}
      />
      <ChooseFileToUpload setAudioFile={setAudioFile} />
      <UploadFile storyData={storyData} />
    </div>
  );
}
