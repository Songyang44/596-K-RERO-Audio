import { getSolidDataset, getThingAll, asUrl } from '@inrupt/solid-client';

export async function getFolderFiles(folderUri, fetch) {
  try {
    const folderDataset = await getSolidDataset(folderUri, { fetch });
    const things = getThingAll(folderDataset);

    // Assuming every 'thing' in the dataset is a file, extract their URLs
    // You might want to add additional checks if there could be non-file things
    const fileUrls = things.map(thing => asUrl(thing, folderDataset));

    return fileUrls;
  } catch (error) {
    console.error("Error fetching folder files:", error);
    throw error;
  }
}
