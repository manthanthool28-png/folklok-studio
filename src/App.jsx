import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Instruments } from './pages/Instruments';
import { Members } from './pages/Members';
import { Music } from './pages/Music';
import { Shows } from './pages/Shows';
import { Booking } from './pages/Booking';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="texture-cloth flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl text-marigold">४०४</p>
      <h1 className="mt-3 font-display text-3xl text-espresso">This page wandered off</h1>
      <Link
        to="/"
        className="mt-7 rounded-full bg-espresso px-6 py-3 font-body text-sm font-600 text-cream transition-colors hover:bg-espresso-light"
      >
        Back home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only font-body focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded focus:bg-marigold focus:px-4 focus:py-2 focus:text-espresso"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/instruments" element={<Instruments />} />
            <Route path="/members" element={<Members />} />
            <Route path="/music" element={<Music />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
