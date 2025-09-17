import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackForm from './components/FeedbackForm';
import VideoBackground from './components/VideoBackground';
import SwipePrompt from './components/SwipePrompt';
import { submitFeedback } from './services/api';
import { emitFeedback } from './services/socket';
import './App.css';

const PAPER_COLORS = ['blue', 'red', 'green', 'yellow', 'purple'];

function App() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [showSwipePrompt, setShowSwipePrompt] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const videoRef = useRef(null);

  const currentColor = PAPER_COLORS[currentColorIndex];

  const handleFormSubmit = async (feedbackData) => {
    try {
      // Add color theme to feedback data
      const feedbackWithColor = {
        ...feedbackData,
        colorTheme: currentColor
      };

      // Store feedback for socket emission
      setCurrentFeedback(feedbackWithColor);

      // Submit to API
      await submitFeedback(feedbackWithColor);

      // Hide form and start video
      setShowForm(false);
      setIsVideoPlaying(true);

      // Start video playback
      if (videoRef.current) {
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setShowSwipePrompt(true);
    
    // Keep the video at the last frame (the paper ball)
    if (videoRef.current) {
      videoRef.current.pause();
      // Ensure we're at the very end of the video
      videoRef.current.currentTime = videoRef.current.duration;
    }
  };

  const handleSwipeUp = () => {
    // Emit socket event
    if (currentFeedback) {
      emitFeedback(currentFeedback);
    }

    // Reset for next user
    setShowSwipePrompt(false);
    setShowForm(true);
    setCurrentFeedback(null);
    
    // Switch to next color
    setCurrentColorIndex((prev) => (prev + 1) % PAPER_COLORS.length);
    
    // Reset video to beginning for next user
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="app">
      <VideoBackground
        ref={videoRef}
        color={currentColor}
        isPlaying={isVideoPlaying}
        onVideoEnd={handleVideoEnd}
      />
      
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="form-overlay"
            initial={{ opacity: 1, zIndex: 10 }}
            animate={{ opacity: 1, zIndex: 10 }}
            exit={{ 
              opacity: 0, 
              zIndex: -5,
              transition: { duration: 0.5 }
            }}
          >
            <FeedbackForm 
              onSubmit={handleFormSubmit}
              paperColor={currentColor}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwipePrompt && (
          <SwipePrompt onSwipeUp={handleSwipeUp} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
