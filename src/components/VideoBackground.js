import React, { forwardRef, useEffect } from 'react';
import './VideoBackground.css';

const VideoBackground = forwardRef(({ color, isPlaying, onVideoEnd }, ref) => {
  // Log when color changes to debug
  useEffect(() => {
    console.log(`VideoBackground component received color: ${color}`);
    
    // Force update the video source when color changes
    if (ref.current) {
      // Clear any cached sources
      ref.current.innerHTML = '';
      
      // Create new source elements
      const source1 = document.createElement('source');
      source1.src = `/assets/videos/paper-${color}.mp4`;
      source1.type = 'video/webm';
      
      const source2 = document.createElement('source');
      source2.src = `/assets/videos/paper-${color}.mp4`;
      source2.type = 'video/mp4';
      
      // Add sources to video element
      ref.current.appendChild(source1);
      ref.current.appendChild(source2);
      
      // Force reload
      ref.current.load();
      
      console.log(`Dynamically set video sources for color: ${color}`);
      console.log(`WebM source: /assets/videos/paper-${color}.mp4`);
    }
  }, [color, ref]);

  return (
    <div className="video-background">
      <video
        ref={ref}
        className="paper-video"
        muted
        playsInline
        onEnded={onVideoEnd}
        preload="metadata"
        onError={(e) => console.error(`Error loading video: ${e.target.error?.message || 'unknown error'}`, color)}
        onLoadStart={() => console.log(`Started loading video: paper-${color}.mp4`)}
        onCanPlay={() => console.log(`Video can play now: paper-${color}.mp4`)}
      >
        <source src={`/assets/videos/paper-${color}.mp4`} type="video/webm" />
        <source src={`/assets/videos/paper-${color}.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Fallback background if video doesn't load */}
      <div className={`fallback-background ${color}`} />
    </div>
  );
});

VideoBackground.displayName = 'VideoBackground';

export default VideoBackground;
