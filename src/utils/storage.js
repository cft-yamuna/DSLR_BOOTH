export function isFileSystemAccessSupported() {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';
}

export async function pickStorageFolder() {
  if (!isFileSystemAccessSupported()) {
    throw new Error('Folder selection is only available in Google Chrome or Microsoft Edge.');
  }

  const handle = await window.showDirectoryPicker({
    mode: 'readwrite',
  });

  await ensureDirectoryPermission(handle);
  return handle;
}

export async function ensureDirectoryPermission(directoryHandle) {
  if (!directoryHandle) {
    throw new Error('Please select a storage folder before starting the photo booth.');
  }

  const permissionOptions = { mode: 'readwrite' };
  const currentPermission = await directoryHandle.queryPermission(permissionOptions);

  if (currentPermission === 'granted') {
    return;
  }

  const requestedPermission = await directoryHandle.requestPermission(permissionOptions);

  if (requestedPermission !== 'granted') {
    throw new Error('Folder permission is unavailable. Please reconnect the storage folder.');
  }
}

export function dataUrlToBlob(dataUrl) {
  const [metadata, base64Data] = dataUrl.split(',');
  const mimeMatch = metadata.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] || 'image/png';
  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

export async function savePhotoToFolder(directoryHandle, dataUrl) {
  await ensureDirectoryPermission(directoryHandle);

  const timestamp = Math.floor(Date.now() / 1000);
  const fileName = `photo-${timestamp}.png`;
  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  const blob = dataUrlToBlob(dataUrl);

  try {
    await writable.write(blob);
  } finally {
    await writable.close();
  }

  return fileName;
}
