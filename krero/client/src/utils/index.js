import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
  overwriteFile
} from "@inrupt/solid-client";

export async function getOrCreateNewPost(containerUri, fetch, audioFile, imageFile,textContent) {
 
  try {
    

    if (audioFile) {
      const audioFileUrl = `${containerUri}${audioFile.name}`;
      await overwriteFile(audioFileUrl, audioFile, { fetch, contentType: audioFile.type });
    }

    if (imageFile) {
      const imageFileUrl = `${containerUri}${imageFile.name}`;
      await overwriteFile(imageFileUrl, imageFile, { fetch, contentType: imageFile.type });
    }
    if (textContent) {
      const textFileUrl = `${containerUri}speechText.txt`;
      const textBlob = new Blob([textContent], { type: "text/plain" });
      await overwriteFile(textFileUrl, textBlob, { fetch, contentType: "text/plain" });
    }

   
  } catch (error) {
    if (error.statusCode === 404) {
      

      if (audioFile) {
        const audioFileUrl = `${containerUri}${audioFile.name}`;
        await overwriteFile(audioFileUrl, audioFile, { fetch, contentType: audioFile.type });
      }

      if (imageFile) {
        const imageFileUrl = `${containerUri}${imageFile.name}`;
        await overwriteFile(imageFileUrl, imageFile, { fetch, contentType: imageFile.type });
      }

      if (textContent) {
        const textFileUrl = `${containerUri}speechText.txt`;
        const textBlob = new Blob([textContent], { type: "text/plain" });
        await overwriteFile(textFileUrl, textBlob, { fetch, contentType: "text/plain" });
      }

      
    } else {
      throw error;
    }
  }
}
