import { createContext, useContext, useMemo, useState } from 'react';

const PhotoBoothContext = createContext(null);

export function PhotoBoothProvider({ children }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [storageFolderHandle, setStorageFolderHandle] = useState(null);
  const [storageFolderName, setStorageFolderName] = useState('');
  const [storageMessage, setStorageMessage] = useState('');
  const [storageError, setStorageError] = useState('');

  const resetPhoto = () => {
    setCapturedImage(null);
    setFinalImage(null);
  };

  const clearStorageFolder = () => {
    setStorageFolderHandle(null);
    setStorageFolderName('');
  };

  const value = useMemo(
    () => ({
      capturedImage,
      finalImage,
      storageFolderHandle,
      storageFolderName,
      storageMessage,
      storageError,
      setCapturedImage,
      setFinalImage,
      setStorageFolderHandle,
      setStorageFolderName,
      setStorageMessage,
      setStorageError,
      resetPhoto,
      clearStorageFolder,
    }),
    [capturedImage, finalImage, storageFolderHandle, storageFolderName, storageMessage, storageError]
  );

  return <PhotoBoothContext.Provider value={value}>{children}</PhotoBoothContext.Provider>;
}

export function usePhotoBooth() {
  const context = useContext(PhotoBoothContext);

  if (!context) {
    throw new Error('usePhotoBooth must be used inside PhotoBoothProvider');
  }

  return context;
}
