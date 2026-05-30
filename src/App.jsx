import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import CameraPage from './pages/CameraPage.jsx';
import HomePage from './pages/HomePage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import ResultPage from './pages/ResultPage.jsx';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<CameraPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
