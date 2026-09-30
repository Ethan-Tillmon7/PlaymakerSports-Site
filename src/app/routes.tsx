import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from '@/features/home/HomePage';

// HomePage is the landing route — keep it in the main chunk for the fastest
// first paint. Every other route is split into its own lazily-loaded chunk.
const ApparelPage = lazy(() => import('@/features/apparel/ApparelPage').then((m) => ({ default: m.ApparelPage })));
const EventsPage = lazy(() => import('@/features/events/EventsPage').then((m) => ({ default: m.EventsPage })));
const AboutPage = lazy(() => import('@/features/about/AboutPage').then((m) => ({ default: m.AboutPage })));
const FAQPage = lazy(() => import('@/features/faq/FAQPage').then((m) => ({ default: m.FAQPage })));
const ContactPage = lazy(() => import('@/features/contact/ContactPage').then((m) => ({ default: m.ContactPage })));
const CustomizerPage = lazy(() => import('@/features/customizer/CustomizerPage').then((m) => ({ default: m.CustomizerPage })));
const NotFoundPage = lazy(() => import('@/features/not-found/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/apparel" element={<ApparelPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/customizer" element={<CustomizerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
