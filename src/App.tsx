import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ApparelPage } from './pages/ApparelPage';
import { EventsPage } from './pages/EventsPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { CustomizerPage } from './pages/CustomizerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoadingBar } from './components/ui/LoadingBar';
import { RouteTransition } from './components/layout/RouteTransition';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <LoadingBar />
      <ScrollToTop />
      <RouteTransition key={pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/apparel" element={<ApparelPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/customizer" element={<CustomizerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RouteTransition>
    </>
  );
}
