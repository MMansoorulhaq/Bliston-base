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
  const playlistRef = useRef<MediaItem[]>([]);

  // Fetch media from uploads directory
  const loadMedia = async () => {
    try {
      const response = await fetch('/api/media/list');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded media from API:', data);
        if (data.media && data.media.length > 0) {
          console.log('Setting media playlist with', data.media.length, 'items:', data.media);
          playlistRef.current = data.media;
          setMediaPlaylist(data.media);
          setLastTimestamp(data.timestamp);
        } else {
          console.log('No media found, using default video');
          // Fallback to default video
          const defaultMedia = [{
            filename: 'homepage.mp4',
            type: 'video' as const,
            url: '/videos/homepage.mp4'
          }];
          playlistRef.current = defaultMedia;
          setMediaPlaylist(defaultMedia);
        }
      } else {
        console.error('Failed to fetch media, status:', response.status);
        const defaultMedia = [{
          filename: 'homepage.mp4',
          type: 'video' as const,
          url: '/videos/homepage.mp4'
        }];
        playlistRef.current = defaultMedia;
        setMediaPlaylist(defaultMedia);
      }
    } catch (error) {
      console.error('Failed to load media:', error);
      const defaultMedia = [{
        filename: 'homepage.mp4',
        type: 'video' as const,
        url: '/videos/homepage.mp4'
      }];
      playlistRef.current = defaultMedia;
      setMediaPlaylist(defaultMedia);
    }
  };

  // Initial load
  useEffect(() => {
    loadMedia();
  }, []);

  // Auto-refresh: Poll for updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/media/list');
        if (response.ok) {
          const data = await response.json();
          // Check if timestamp changed (content updated)
          if (data.timestamp !== lastTimestamp && data.media) {
            playlistRef.current = data.media;
            setMediaPlaylist(data.media);
            setLastTimestamp(data.timestamp);
            setCurrentMediaIndex(0); // Reset to first item
          }
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
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
    console.log('Video ended, moving to next media');
    const playlist = playlistRef.current;
    if (playlist.length > 0) {
      setCurrentMediaIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % playlist.length;
        console.log('Next index will be:', nextIndex, 'out of', playlist.length);
        return nextIndex;
      });
    }
  };

  // Auto-play media when index changes
  useEffect(() => {
    const playlist = playlistRef.current;
    
    if (playlist.length === 0) {
      console.warn('Media playlist is empty');
      return;
    }

    const currentMedia = playlist[currentMediaIndex];
    if (!currentMedia) {
      console.warn('No current media at index', currentMediaIndex, 'Playlist length:', playlist.length);
      return;
    }

    console.log(`[${currentMediaIndex + 1}/${playlist.length}] Playing media:`, currentMedia.type, currentMedia.filename, 'Duration:', currentMedia.duration);
    console.log('Full playlist:', playlist.map(m => `${m.type}:${m.filename}`).join(', '));

    // Clear any existing image timer
    if (imageTimerRef.current) {
      console.log('Clearing existing image timer');
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }

    if (currentMedia.type === 'video') {
      if (videoRef.current) {
        console.log('Loading and playing video:', currentMedia.url);
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playing successfully');
            })
            .catch(err => {
              console.error('Autoplay prevented or failed:', err);
            });
        }
      } else {
        console.error('Video ref is null!');
      }
    } else if (currentMedia.type === 'image') {
      // Set timer for image duration
      const imageDuration = (currentMedia.duration || 10) * 1000; // Convert to milliseconds
      console.log('Setting image timer for', imageDuration, 'ms (', currentMedia.duration, 'seconds)');
      
      imageTimerRef.current = setTimeout(() => {
        console.log('Image timer expired, moving to next media');
        setCurrentMediaIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % playlist.length;
          console.log('Next index will be:', nextIndex, 'out of', playlist.length);
          return nextIndex;
        });
      }, imageDuration);
    }

    return () => {
      if (imageTimerRef.current) {
        console.log('Cleanup: Clearing image timer');
        clearTimeout(imageTimerRef.current);
        imageTimerRef.current = null;
      }
    };
  }, [currentMediaIndex]);

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
            autoPlay
            muted
            playsInline
            preload="auto"
            key={`video-${currentMediaIndex}`}
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
