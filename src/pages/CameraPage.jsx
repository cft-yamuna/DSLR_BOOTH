import { Camera, FolderOpen, Settings, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { usePhotoBooth } from '../context/PhotoBoothContext.jsx';
import ActionButton from '../components/ActionButton.jsx';
import { pickStorageFolder } from '../utils/storage.js';
import captureButton from '../assets/images/capture.png';

const videoConstraints = {
  facingMode: 'user',
  width: { ideal: 3840 },
  height: { ideal: 2160 },
};

export default function CameraPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const {
    setCapturedImage,
    setFinalImage,
    storageFolderName,
    storageMessage,
    storageError,
    setStorageFolderHandle,
    setStorageFolderName,
    setStorageMessage,
    setStorageError,
  } = usePhotoBooth();
  const [cameraError, setCameraError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setCameraError('Camera is not ready yet. Please allow access and try again.');
      return;
    }

    setCapturedImage(imageSrc);
    setFinalImage(null);
    navigate('/preview');
  }, [navigate, setCapturedImage, setFinalImage]);

  const handleUserMediaError = (error) => {
    const isDenied =
      error?.name === 'NotAllowedError' ||
      error?.name === 'PermissionDeniedError' ||
      error?.message?.toLowerCase().includes('permission');

    setCameraError(
      isDenied
        ? 'Camera permission was denied. Please allow webcam access in your browser settings and reload this page.'
        : 'The webcam could not be started. Please check that a camera is connected and available.'
    );
  };

  return (
    <section className="page brand-page camera-page">
      <div className="brand-stage">
        <button
          className="settings-toggle no-print"
          onClick={() => setSettingsOpen((isOpen) => !isOpen)}
          aria-label="Open settings"
        >
          {settingsOpen ? <X aria-hidden="true" size={24} /> : <Settings aria-hidden="true" size={24} />}
        </button>

        {settingsOpen ? (
          <div className="settings-panel no-print">
            <h2>Settings</h2>
            <ActionButton icon={FolderOpen} variant="secondary" onClick={handleSelectFolder}>
              Select Storage Folder
            </ActionButton>

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
        ) : null}

        <div className="camera-frame">
          {cameraError ? (
            <div className="camera-error" role="alert">
              <Camera aria-hidden="true" size={42} />
              <p>{cameraError}</p>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                forceScreenshotSourceSize
                imageSmoothing
                mirrored
                screenshotFormat="image/png"
                screenshotQuality={1}
                minScreenshotWidth={1920}
                minScreenshotHeight={1080}
                videoConstraints={videoConstraints}
                onUserMedia={() => setCameraReady(true)}
                onUserMediaError={handleUserMediaError}
                className="webcam"
              />
              {!cameraReady ? <div className="camera-loading">Starting camera...</div> : null}
            </>
          )}
        </div>

        <button
          className="image-button capture-image-button"
          onClick={handleCapture}
          disabled={Boolean(cameraError)}
          aria-label="Capture"
        >
          <img src={captureButton} alt="" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
