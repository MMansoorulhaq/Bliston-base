'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

interface MediaItem {
  filename: string;
  type: 'video' | 'image';
  size: number;
  resolution: string;
  url: string;
  uploadedAt: string;
  duration?: number;
  originalName?: string;
}

interface UserSession {
  userId: string;
  username: string;
  role: 'admin' | 'user';
}

const MAX_ITEMS = 4;

export default function DashboardPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'video' | 'image'>('video');
  const [imageDuration, setImageDuration] = useState<number>(10);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initial load
  useEffect(() => {
    fetchMedia();
    fetchUserSession();
  }, []);

  // Auto-refresh: Poll for updates every 5 seconds
  useEffect(() => {
    console.log('🔄 Admin dashboard auto-refresh started (checking every 5 seconds)');
    
    const interval = setInterval(async () => {
      console.log('🔍 Admin: Checking for media updates...');
      await fetchMedia();
    }, 5000); // Check every 5 seconds

    return () => {
      console.log('🛑 Admin dashboard auto-refresh stopped');
      clearInterval(interval);
    };
  }, []);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUserSession(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
    }
  };

  const fetchMedia = async () => {
    try {
      console.log('📡 Admin: Fetching media from /api/media/info...');
      const response = await fetch('/api/media/info', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newMediaCount = data.media?.length || 0;
        const currentMediaCount = media.length;
        
        console.log('✅ Admin: Fetched', newMediaCount, 'media items');
        
        if (newMediaCount !== currentMediaCount) {
          console.log('🔄 Admin: Media count changed from', currentMediaCount, 'to', newMediaCount);
        }
        
        setMedia(data.media || []);
        setLastUpdate(Date.now());
      } else {
        console.error('❌ Admin: Failed to fetch media, status:', response.status);
      }
    } catch (err) {
      console.error('❌ Admin: Failed to fetch media:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    // Check media limit
    if (media.length >= MAX_ITEMS) {
      setError(`Maximum item limit reached. You can only upload ${MAX_ITEMS} items total.`);
      return;
    }

    // Determine file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setError('Invalid file type. Please upload a video or image.');
      return;
    }

    setFileType(isVideo ? 'video' : 'image');

    // Validate file type
    if (isVideo) {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid video type. Please upload MP4, WebM, or OGG.');
        return;
      }
    } else if (isImage) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid image type. Please upload JPEG, PNG, or WebP.');
        return;
      }
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);

    // Validate resolution
    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        
        if (video.videoWidth !== 1080 || video.videoHeight !== 1920) {
          setError(`Invalid resolution: ${video.videoWidth}×${video.videoHeight}. Required: 1080×1920 (vertical)`);
          setSelectedFile(null);
          setPreviewUrl(null);
        }
      };

      video.src = url;
    } else if (isImage) {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        if (img.width !== 1080 || img.height !== 1920) {
          setError(`Invalid resolution: ${img.width}×${img.height}. Required: 1080×1920 (vertical)`);
          setSelectedFile(null);
          setPreviewUrl(null);
        }
      };
      img.src = url;
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;

    setShowConfirmation(false);
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', fileType);
    if (fileType === 'image') {
      formData.append('duration', imageDuration.toString());
    }

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Upload successful, refreshing media list...');
        setSuccess(`${fileType === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageDuration(10);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Force immediate refresh
        await fetchMedia();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(`/api/media/delete?filename=${filename}`, { 
        method: 'DELETE' 
      });
      const data = await response.json();

      if (response.ok) {
        console.log('✅ Delete successful, refreshing media list...');
        setSuccess('Item deleted successfully');
        setDeleteConfirm(null);
        
        // Force immediate refresh
        await fetchMedia();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch (err) {
      setError('An error occurred during deletion');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newMedia = [...media];
    const draggedItem = newMedia[draggedIndex];
    
    // Remove dragged item
    newMedia.splice(draggedIndex, 1);
    // Insert at new position
    newMedia.splice(dropIndex, 0, draggedItem);
    
    setMedia(newMedia);
    setDraggedIndex(null);

    // Save new order to backend
    try {
      const order = newMedia.map(item => item.filename);
      const response = await fetch('/api/media/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });

      if (response.ok) {
        console.log('✅ Reorder successful');
        setSuccess('Media order updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save new order');
        await fetchMedia(); // Revert to original order
      }
    } catch (err) {
      setError('Failed to save new order');
      await fetchMedia(); // Revert to original order
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const canUploadMore = media.length < MAX_ITEMS;
  const isAdmin = userSession?.role === 'admin';

  return (
    <div className="dashboard-container vertical">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div>
              <h1>Media Management Dashboard</h1>
              <p className="header-subtitle">
                {userSession && (
                  <span className="user-badge">
                    {userSession.role === 'admin' ? '👑' : '👤'} {userSession.username} ({userSession.role})
                  </span>
                )}
                {' • '}
                {media.length}/{MAX_ITEMS} items
              </p>
            </div>
          </div>
          <div className="header-actions">
            {isAdmin && (
              <>
                <button 
                  onClick={() => router.push('/admin/activity-logs')} 
                  className="logs-button"
                  title="View Activity Logs"
                >
                  📋 Logs
                </button>
                <button 
                  onClick={() => router.push('/admin/users')} 
                  className="users-button"
                  title="User Management"
                >
                  👥 Users
                </button>
              </>
            )}
            <button onClick={handleLogout} className="logout-button">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Upload Section */}
        <section className="dashboard-section upload-section">
          <div className="section-header">
            <h2>📤 Upload New Media</h2>
            {!canUploadMore && (
              <span className="limit-badge">Maximum Limit Reached</span>
            )}
          </div>

          <div className="upload-requirements">
            <h3>📋 Requirements:</h3>
            <ul>
              <li>✓ Resolution: <strong>1080 × 1920</strong> (vertical)</li>
              <li>✓ Videos: MP4, WebM, or OGG</li>
              <li>✓ Images: JPEG, PNG, or WebP</li>
              <li>✓ Maximum items: <strong>{MAX_ITEMS}</strong> (videos + images)</li>
              <li>✓ Current count: <strong>{media.length}/{MAX_ITEMS}</strong></li>
            </ul>
          </div>

          {canUploadMore ? (
            <div className="upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="file-input"
                id="media-upload"
                disabled={!canUploadMore}
              />
              <label htmlFor="media-upload" className={`file-label ${!canUploadMore ? 'disabled' : ''}`}>
                <span className="upload-icon">📁</span>
                Choose Video or Image File
              </label>

              {selectedFile && (
                <div className="selected-file-info">
                  <p><strong>{fileType === 'video' ? '📹' : '🖼️'} Selected:</strong> {selectedFile.name}</p>
                  <p><strong>💾 Size:</strong> {formatFileSize(selectedFile.size)}</p>
                  <p><strong>📂 Type:</strong> {fileType === 'video' ? 'Video' : 'Image'}</p>
                </div>
              )}

              {selectedFile && fileType === 'image' && !error && (
                <div className="duration-input-container">
                  <label htmlFor="duration">
                    <strong>⏱️ Display Duration (seconds):</strong>
                  </label>
                  <input
                    type="number"
                    id="duration"
                    min="1"
                    max="300"
                    value={imageDuration}
                    onChange={(e) => setImageDuration(Number(e.target.value))}
                    className="duration-input"
                  />
                  <small>How long should this image be displayed? (1-300 seconds)</small>
                </div>
              )}

              {previewUrl && (
                <div className="upload-preview">
                  {fileType === 'video' ? (
                    <video src={previewUrl} controls className="preview-player" />
                  ) : (
                    <img src={previewUrl} alt="Preview" className="preview-player" />
                  )}
                </div>
              )}

              {error && <div className="error-message">⚠️ {error}</div>}
              {success && <div className="success-message">✅ {success}</div>}

              {selectedFile && !error && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="upload-button"
                >
                  {uploading ? '⏳ Uploading...' : `⬆️ Upload ${fileType === 'video' ? 'Video' : 'Image'}`}
                </button>
              )}
            </div>
          ) : (
            <div className="limit-reached-message">
              <div className="limit-icon">🚫</div>
              <h3>Maximum Media Limit Reached</h3>
              <p>You have uploaded the maximum of {MAX_ITEMS} items.</p>
              <p>Please delete an item to upload a new one.</p>
            </div>
          )}
        </section>

        {/* Media Gallery */}
        <section className="dashboard-section gallery-section">
          <div className="section-header">
            <h2>🎬 Media Gallery</h2>
            <span className="video-count-badge">{media.length} item{media.length !== 1 ? 's' : ''}</span>
          </div>

          {media.length > 0 && (
            <div className="reorder-hint">
              <span className="hint-icon">💡</span>
              <strong>Tip:</strong> Drag and drop items to change their display order on the homepage
            </div>
          )}

          {media.length === 0 ? (
            <div className="no-videos">
              <div className="no-videos-icon">📹</div>
              <h3>No Media Uploaded Yet</h3>
              <p>Upload your first video or image to get started!</p>
            </div>
          ) : (
            <div className="video-grid">
              {media.map((item, index) => (
                <div 
                  key={item.filename} 
                  className={`video-card ${draggedIndex === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="video-card-header">
                    <span className="video-number">
                      {item.type === 'video' ? '📹' : '🖼️'} #{index + 1}
                    </span>
                    <div className="card-actions">
                      <span className="drag-handle" title="Drag to reorder">⋮⋮</span>
                      <button
                        onClick={() => setDeleteConfirm(item.filename)}
                        className="delete-icon-button"
                        title={`Delete ${item.type}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="video-preview-container">
                    {item.type === 'video' ? (
                      <video
                        src={item.url}
                        className="video-thumbnail"
                        controls
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        className="video-thumbnail"
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </div>

                  <div className="video-details">
                    <div className="detail-item">
                      <span className="detail-icon">📂</span>
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{item.type === 'video' ? 'Video' : 'Image'}</span>
                    </div>
                    {item.originalName && (
                      <div className="detail-item">
                        <span className="detail-icon">📄</span>
                        <span className="detail-label">Name:</span>
                        <span className="detail-value" title={item.originalName}>
                          {item.originalName.length > 20 ? item.originalName.substring(0, 20) + '...' : item.originalName}
                        </span>
                      </div>
                    )}
                    {item.type === 'image' && item.duration && (
                      <div className="detail-item">
                        <span className="detail-icon">⏱️</span>
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{item.duration}s</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-icon">📐</span>
                      <span className="detail-label">Resolution:</span>
                      <span className="detail-value">{item.resolution}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💾</span>
                      <span className="detail-label">Size:</span>
                      <span className="detail-value">{formatFileSize(item.size)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Uploaded:</span>
                      <span className="detail-value">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Upload Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{fileType === 'video' ? '🎬' : '🖼️'} Confirm Upload</h3>
            <p>Are you sure you want to upload this {fileType}?</p>
            {fileType === 'image' && (
              <p className="modal-info">Display duration: {imageDuration} seconds</p>
            )}
            <p className="modal-info">This {fileType} will be added to your playlist.</p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirmation(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={confirmUpload} className="confirm-button">
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🗑️ Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)} className="cancel-button">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="delete-confirm-button">
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
