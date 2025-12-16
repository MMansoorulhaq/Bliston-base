'use client';

import { useState, useRef, useEffect } from 'react';
import { fetchGoogleReviews, GoogleReview } from '../lib/googleReviewsApi';

interface MediaItem {
  filename: string;
  type: 'video' | 'image';
  url: string;
  duration?: number;
}

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaPlaylist, setMediaPlaylist] = useState<MediaItem[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [duration, setDuration] = useState('20s');

  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch media from uploads directory
  const loadMedia = async () => {
    try {
      console.log('🔄 Fetching media from /api/media/list...');
      const response = await fetch('/api/media/list');
      console.log('📡 API Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Loaded media from API:', data);
        
        if (data.media && data.media.length > 0) {
          console.log('✅ Setting media playlist with', data.media.length, 'items');
          console.log('📋 Media items:', data.media.map((m: MediaItem) => `${m.type}:${m.filename}`).join(', '));
          
          setMediaPlaylist(data.media);
          setLastTimestamp(data.timestamp);
          console.log('✅ State updated successfully');
        } else {
          console.warn('⚠️ No media found in API response, using default video');
          // Fallback to default video
          const defaultMedia = [{
            filename: 'homepage.mp4',
            type: 'video' as const,
            url: '/videos/homepage.mp4'
          }];
          setMediaPlaylist(defaultMedia);
        }
      } else {
        console.error('❌ Failed to fetch media, status:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        const defaultMedia = [{
          filename: 'homepage.mp4',
          type: 'video' as const,
          url: '/videos/homepage.mp4'
        }];
        setMediaPlaylist(defaultMedia);
      }
    } catch (error) {
      console.error('❌ Failed to load media (exception):', error);
      const defaultMedia = [{
        filename: 'homepage.mp4',
        type: 'video' as const,
        url: '/videos/homepage.mp4'
      }];
      setMediaPlaylist(defaultMedia);
    }
  };

  // Initial load
  useEffect(() => {
    loadMedia();
  }, []);

  // Auto-refresh: Poll for updates every 10 seconds
  useEffect(() => {
    console.log('🔄 Auto-refresh polling started (checking every 10 seconds)');
    
    const interval = setInterval(async () => {
      try {
        console.log('🔍 Checking for content updates...');
        const response = await fetch('/api/media/list', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Current timestamp:', lastTimestamp, 'New timestamp:', data.timestamp);
          
          // Check if timestamp changed (content updated)
          if (lastTimestamp !== 0 && data.timestamp !== lastTimestamp && data.media) {
            console.log('🔄 Content updated detected! Reloading playlist...');
            console.log('📋 New media count:', data.media.length);
            setMediaPlaylist(data.media);
            setLastTimestamp(data.timestamp);
            setCurrentMediaIndex(0); // Reset to first item
            console.log('✅ Playlist reloaded successfully');
          } else {
            console.log('✓ No changes detected');
          }
        }
      } catch (error) {
        console.error('❌ Failed to check for updates:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      console.log('🛑 Auto-refresh polling stopped');
      clearInterval(interval);
    };
  }, [lastTimestamp]);

  // Fetch Google reviews
  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchGoogleReviews();
      setReviews(data);
    };
    loadReviews();
  }, []);

  // Handle review rotation and animation
  useEffect(() => {
    if (reviews.length === 0) return;

    setIsAnimating(false);

    const resetTimer = setTimeout(() => {
      if (textRef.current && containerRef.current) {
        const totalDistance = textRef.current.scrollWidth;
        const speed = 50;
        const calculatedDuration = totalDistance / speed;
        const finalDuration = Math.max(calculatedDuration, 10);

        setDuration(`${finalDuration}s`);
        setIsAnimating(true);

        const nextReviewTimer = setTimeout(() => {
          setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        }, finalDuration * 1000);

        return () => clearTimeout(nextReviewTimer);
      }
    }, 100);

    return () => clearTimeout(resetTimer);
  }, [currentReviewIndex, reviews.length]);

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Handle video end
  const handleVideoEnd = () => {
    console.log('🏁 Video ended, moving to next media');
    if (mediaPlaylist.length > 0) {
      setCurrentMediaIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % mediaPlaylist.length;
        console.log('➡️ Next index will be:', nextIndex, 'out of', mediaPlaylist.length);
        return nextIndex;
      });
    }
  };

  // Auto-play media when index changes
  useEffect(() => {
    // Use state playlist instead of ref to avoid race condition
    if (mediaPlaylist.length === 0) {
      console.log('⏳ Media playlist is empty, waiting for data to load...');
      return;
    }

    const currentMedia = mediaPlaylist[currentMediaIndex];
    if (!currentMedia) {
      console.error('❌ No current media at index', currentMediaIndex, 'Playlist length:', mediaPlaylist.length);
      return;
    }

    console.log(`▶️ [${currentMediaIndex + 1}/${mediaPlaylist.length}] Playing media:`, currentMedia.type, currentMedia.filename, 'Duration:', currentMedia.duration);
    console.log('📋 Full playlist:', mediaPlaylist.map(m => `${m.type}:${m.filename}`).join(', '));
    
    if (mediaPlaylist.length === 1 && currentMedia.type === 'video') {
      console.log('🔁 Single video mode: Auto-loop enabled');
    }

    // Clear any existing image timer
    if (imageTimerRef.current) {
      console.log('Clearing existing image timer');
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }

    if (currentMedia.type === 'video') {
      if (videoRef.current) {
        console.log('🎬 Loading video:', currentMedia.url);
        // Force reload the video
        videoRef.current.src = currentMedia.url;
        videoRef.current.load();
        
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Video playing successfully');
            })
            .catch(err => {
              console.error('❌ Autoplay prevented or failed:', err);
              // Try to play on next user interaction
              const playOnClick = () => {
                console.log('🖱️ User clicked, attempting to play video');
                videoRef.current?.play();
                document.removeEventListener('click', playOnClick);
              };
              document.addEventListener('click', playOnClick);
            });
        }
      } else {
        console.error('❌ Video ref is null!');
      }
    } else if (currentMedia.type === 'image') {
      // Set timer for image duration
      const imageDuration = (currentMedia.duration || 10) * 1000; // Convert to milliseconds
      console.log('🖼️ Setting image timer for', imageDuration, 'ms (', currentMedia.duration, 'seconds)');
      
      imageTimerRef.current = setTimeout(() => {
        console.log('⏰ Image timer expired, moving to next media');
        setCurrentMediaIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % mediaPlaylist.length;
          console.log('➡️ Next index will be:', nextIndex, 'out of', mediaPlaylist.length);
          return nextIndex;
        });
      }, imageDuration);
    }

    return () => {
      if (imageTimerRef.current) {
        console.log('🧹 Cleanup: Clearing image timer');
        clearTimeout(imageTimerRef.current);
        imageTimerRef.current = null;
      }
    };
  }, [currentMediaIndex, mediaPlaylist]);

  if (mediaPlaylist.length === 0) {
    return (
      <section className="video-section">
        <div className="video-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: '#000',
            color: '#fff',
            fontSize: '24px'
          }}>
            Loading media...
          </div>
        </div>
      </section>
    );
  }

  const currentMedia = mediaPlaylist[currentMediaIndex];
  const isSingleVideo = mediaPlaylist.length === 1 && currentMedia?.type === 'video';

  return (
    <section className="video-section">
      <div className="video-container">
        {currentMedia?.type === 'video' ? (
          <video
            ref={videoRef}
            className="video-player"
            onPause={handlePause}
            onPlay={handlePlay}
            onEnded={handleVideoEnd}
            onError={(e) => {
              console.error('❌ Video error:', e);
              console.error('❌ Video src:', currentMedia.url);
              console.error('❌ Video readyState:', videoRef.current?.readyState);
              console.error('❌ Video networkState:', videoRef.current?.networkState);
              const videoElement = e.currentTarget as HTMLVideoElement;
              if (videoElement.error) {
                console.error('❌ Video error code:', videoElement.error.code);
                console.error('❌ Video error message:', videoElement.error.message);
              }
            }}
            onLoadedData={() => {
              console.log('✅ Video loaded successfully, readyState:', videoRef.current?.readyState);
            }}
            onCanPlay={() => {
              console.log('✅ Video can play');
            }}
            autoPlay
            muted
            playsInline
            loop={isSingleVideo}
            preload="auto"
            key={`video-${currentMediaIndex}-${currentMedia.filename}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              background: '#000',
              filter: 'contrast(1.05) saturate(1.1)',
              imageRendering: '-webkit-optimize-contrast'
            }}
          >
            <source src={currentMedia.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            ref={imageRef}
            src={currentMedia?.url}
            alt="Display content"
            className="video-player"
            loading="eager"
            decoding="sync"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              background: '#000',
              filter: 'contrast(1.05) saturate(1.1)',
              imageRendering: '-webkit-optimize-contrast'
            }}
            key={`image-${currentMediaIndex}`}
          />
        )}
      </div>

      {/* Footer - Testimonial Bar with Profile */}
      {reviews.length > 0 && (
        <div className="footer-testimonial-bar">
          <div className="reviewer-profile">
            <div className="profile-circle">
              <span className="profile-initial">{reviews[currentReviewIndex].author_name.charAt(0)}</span>
            </div>
            <div className="reviewer-info">
              <div className="reviewer-name">{reviews[currentReviewIndex].author_name}</div>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < reviews[currentReviewIndex].rating ? 'filled' : 'empty'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="testimonial-text">
            <div className="marquee-wrapper" ref={containerRef}>
              <div
                className={`marquee-text ${isAnimating ? 'animate' : ''}`}
                ref={textRef}
                style={{ '--duration': duration } as React.CSSProperties}
              >
                {reviews[currentReviewIndex].text}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
