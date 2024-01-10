import React, { useState } from "react";
import {
  createSolidDataset,
  saveSolidDatasetAt,
  createContainerAt,
} from "@inrupt/solid-client";
// import { getDefaultSession } from "@inrupt/solid-client-authn";
// import * as solidAuthClient from "solid-auth-client";
import { useSession } from "@inrupt/solid-ui-react";
export default function UploadFile({ storyData }) {
  const [uploading, setUploading] = useState(false);
  const { session } = useSession();
  const handleUpload = async () => {
    if (!storyData) {
      console.error("No story data to upload.");
      return;
    }

    try {
      setUploading(true);

      //   const session = await solidAuthClient.currentSession();

      if (!session) {
        console.error("User is not authenticated.");
        return;
      }

      const { webId } = session.info;
      console.log(webId);

      const audioFile = new File([storyData.audioBlob], "recorded-audio.wav", {
        type: "audio/wav",
      });

      // 创建 Solid 数据集
      const dataset = createSolidDataset();

      //create container
      const containerUri = `${webId}/public/recordings`;
      const createContainer = await createContainerAt(containerUri, {
        fetch: session.fetch,
      });

      // 将音频文件添加到数据集

      //   const updatedDataset = await addContainerTo(
      //     dataset,
      //     webId,
      //     "public/recordings"
      //   );
      const audioUrl = `${createContainer.uri}/recorded-audio.wav`;
      createContainer.addFile(audioUrl, audioFile);

      // 保存数据集到 Solid 服务器
      const savedDataset = await saveSolidDatasetAt(
        dataset,
        createContainer.uri,
        {
          fetch: session.fetch,
        }
      );

      console.log("Story uploaded successfully.");
      // 清空数据或执行其他操作
    } catch (error) {
      console.error("Error uploading story:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      {uploading ? (
        <p>Uploading...</p>
      ) : (
        <button onClick={handleUpload}>Upload Story</button>
      )}
    </div>
  );
}
