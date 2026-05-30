import { Navigate, useNavigate } from 'react-router-dom';
import { usePhotoBooth } from '../context/PhotoBoothContext.jsx';
import homeButton from '../assets/images/home.png';
import printButton from '../assets/images/print.png';

export default function ResultPage() {
  const navigate = useNavigate();
  const { finalImage, resetPhoto } = usePhotoBooth();

  if (!finalImage) {
    return <Navigate to="/" replace />;
  }

  const handleHome = () => {
    resetPhoto();
    navigate('/');
  };

  return (
    <section className="page brand-page result-page">
      <div className="brand-stage">
        <div className="result-layout">
          <div className="result-frame">
            <img src={finalImage} alt="Generated 4 by 6 photo" className="result-frame-photo" />
          </div>

          <div className="result-actions no-print">
            <button className="image-button result-image-button" onClick={() => window.print()} aria-label="Print">
              <img src={printButton} alt="" aria-hidden="true" />
            </button>
            <button className="image-button result-image-button" onClick={handleHome} aria-label="Home">
              <img src={homeButton} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
