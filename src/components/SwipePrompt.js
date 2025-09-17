import React from 'react';
import { motion } from 'framer-motion';
import './SwipePrompt.css';

const SwipePrompt = ({ onSwipeUp }) => {
  const handleDragEnd = (event, info) => {
    // Check if swipe is upward with enough velocity and distance
    if (info.offset.y < -150 && info.velocity.y < -800) {
      onSwipeUp();
    }
  };

  return (
    <motion.div
      className="swipe-prompt-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -window.innerHeight * 1.2,
        transition: { 
          duration: 1.2, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      drag="y"
      dragConstraints={{ top: -100, bottom: 50 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.02
      }}
    >
      <motion.div
        className="throw-instruction"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="swipe-arrow">↑</div>
        <p>Swipe Up</p>
      </motion.div>
    </motion.div>
  );
};

export default SwipePrompt;
