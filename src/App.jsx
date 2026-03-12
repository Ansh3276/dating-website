import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CursorFollower from './components/ui/CursorFollower';
import SmoothScroll from './components/ui/SmoothScroll';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import VideoDate from './pages/VideoDate';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

import './styles/global.css';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/matches" element={<PageTransition><Matches /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/membership" element={<PageTransition><Membership /></PageTransition>} />
        <Route path="/discover" element={<PageTransition><Discover /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
        <Route path="/video-date" element={<PageTransition><VideoDate /></PageTransition>} />
        <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <SmoothScroll>
        <CursorFollower />
        <AnimatedRoutes />
      </SmoothScroll>
    </Router>
  );
}

export default App;
