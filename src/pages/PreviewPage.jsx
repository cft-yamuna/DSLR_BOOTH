import { FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton.jsx';
import { usePhotoBooth } from '../context/PhotoBoothContext.jsx';
import { createFinalPhoto } from '../utils/createFinalPhoto.js';
import { pickStorageFolder, savePhotoToFolder } from '../utils/storage.js';
import retakeButton from '../assets/images/retake.png';
import submitButton from '../assets/images/submit.png';

export default function PreviewPage() {
  const navigate = useNavigate();
  const {
    capturedImage,
    storageFolderHandle,
    setCapturedImage,
    setFinalImage,
    setStorageFolderHandle,
    setStorageFolderName,
    setStorageMessage,
    setStorageError,
    clearStorageFolder,
  } = usePhotoBooth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [needsFolderReconnect, setNeedsFolderReconnect] = useState(false);

  useEffect(() => {
    setGenerationError('');
    setNeedsFolderReconnect(false);
  }, [capturedImage]);

  if (!capturedImage) {
    return <Navigate to="/camera" replace />;
  }

  const handleRetake = () => {
    setCapturedImage(null);
    setFinalImage(null);
    navigate('/camera');
  };

  const handleReconnectFolder = async () => {
    try {
      setGenerationError('');
      setNeedsFolderReconnect(false);
      const folderHandle = await pickStorageFolder();
      setStorageFolderHandle(folderHandle);
      setStorageFolderName(folderHandle.name);
      setStorageMessage(`Storage folder selected: ${folderHandle.name}`);
      setStorageError('');
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      clearStorageFolder();
      setNeedsFolderReconnect(true);
      setGenerationError(
        error instanceof Error
          ? error.message
          : 'The storage folder could not be selected. Please try again.'
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setIsGenerating(true);
      setGenerationError('');
      setNeedsFolderReconnect(false);

      if (!storageFolderHandle) {
        setNeedsFolderReconnect(true);
        throw new Error('Storage folder is missing. Please reconnect the folder and submit again.');
      }

      const finalDataUrl = await createFinalPhoto(capturedImage);
      await savePhotoToFolder(storageFolderHandle, finalDataUrl);
      setFinalImage(finalDataUrl);
      navigate('/result');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'The final photo could not be generated or saved. Please try again.';

      if (message.toLowerCase().includes('folder') || message.toLowerCase().includes('permission')) {
        clearStorageFolder();
        setStorageError(message);
        setNeedsFolderReconnect(true);
      }

      setGenerationError(
        message
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="page brand-page preview-page">
      <div className="brand-stage">
        <div className="preview-photo-wrap">
          <img src={capturedImage} alt="Captured preview" className="preview-photo" />
        </div>

        {generationError ? (
          <p className="inline-error" role="alert">
            {generationError}
          </p>
        ) : null}

        {needsFolderReconnect ? (
          <div className="reconnect-row">
            <ActionButton icon={FolderOpen} variant="secondary" onClick={handleReconnectFolder}>
              Select Storage Folder
            </ActionButton>
          </div>
        ) : null}

        <div className="floating-actions preview-actions">
          <button className="image-button preview-image-button" onClick={handleRetake} aria-label="Retake">
            <img src={retakeButton} alt="" aria-hidden="true" />
          </button>
          <button
            className="image-button preview-image-button"
            onClick={handleSubmit}
            disabled={isGenerating}
            aria-label="Submit"
          >
            <img src={submitButton} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
