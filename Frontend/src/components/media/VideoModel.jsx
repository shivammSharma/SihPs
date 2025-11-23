// src/components/media/VideoModal.jsx
import React, { useEffect, useRef } from 'react';

const VideoModal = ({ isOpen, onClose, video }) => {
  const backdropRef = useRef(null);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!isOpen || !video) return null;

  const youTubeSrc = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  const onBackdrop = (e) => e.target === backdropRef.current && onClose();

  return (
    <div
      ref={backdropRef}
      onClick={onBackdrop}
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
    >
      <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
        <div className="relative pt-[56.25%] bg-black">
          <iframe
            title={video.title}
            className="absolute inset-0 w-full h-full"
            src={youTubeSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <h4 className="text-primary font-semibold pr-4 line-clamp-2">{video.title}</h4>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-border hover:bg-muted"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
