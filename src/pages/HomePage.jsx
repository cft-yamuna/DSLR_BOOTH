import { Camera, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton.jsx';
import { usePhotoBooth } from '../context/PhotoBoothContext.jsx';
import { pickStorageFolder } from '../utils/storage.js';

export default function HomePage() {
  const navigate = useNavigate();
  const {
    resetPhoto,
    storageFolderHandle,
    storageFolderName,
    storageMessage,
    storageError,
    setStorageFolderHandle,
    setStorageFolderName,
    setStorageMessage,
    setStorageError,
  } = usePhotoBooth();

  const handleSelectFolder = async () => {
    try {
      setStorageError('');
      setStorageMessage('');
      const folderHandle = await pickStorageFolder();
      setStorageFolderHandle(folderHandle);
      setStorageFolderName(folderHandle.name);
      setStorageMessage(`Storage folder selected: ${folderHandle.name}`);
    } catch (error) {
      if (error?.name === 'AbortError') {
        return;
      }

      setStorageFolderHandle(null);
      setStorageFolderName('');
      setStorageError(
        error instanceof Error
          ? error.message
          : 'The storage folder could not be selected. Please try again.'
      );
    }
  };

  const handleStart = () => {
    if (!storageFolderHandle) {
      setStorageError('Please select a storage folder before starting.');
      return;
    }

    resetPhoto();
    navigate('/camera');
  };

  return (
    <section className="page brand-page home-page">
      <div className="brand-stage">
        <div className="home-panel">
          <div className="home-actions">
            <ActionButton icon={Camera} onClick={handleStart} disabled={!storageFolderHandle}>
              Start
            </ActionButton>
            <ActionButton icon={FolderOpen} variant="secondary" onClick={handleSelectFolder}>
              Select Storage Folder
            </ActionButton>
          </div>

          {storageMessage ? (
            <p className="status-message status-success" role="status">
              {storageMessage}
            </p>
          ) : null}

          {storageFolderName && !storageMessage ? (
            <p className="status-message status-success" role="status">
              Storage folder selected: {storageFolderName}
            </p>
          ) : null}

          {storageError ? (
            <p className="status-message status-error" role="alert">
              {storageError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
