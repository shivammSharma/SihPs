import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoTestimonial = ({ testimonial }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    // In a real implementation, this would trigger video playback
  };

  return (
    <div className="bg-card rounded-xl organic-shadow overflow-hidden">
      <div className="relative">
        {/* Video Thumbnail */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={testimonial?.thumbnail}
            alt={`${testimonial?.patientName} video testimonial`}
            className="w-full h-full object-cover"
          />
          
          {/* Play Button Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={handlePlayVideo}
                className="bg-white/90 hover:bg-white text-primary rounded-full w-16 h-16 p-0"
              >
                <Icon name="Play" size={24} className="ml-1" />
              </Button>
            </div>
          )}
          
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {testimonial?.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={testimonial?.avatar}
                alt={testimonial?.patientName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-display font-semibold text-lg text-text-primary">
                {testimonial?.patientName}
              </h4>
              <p className="text-sm text-text-secondary">
                {testimonial?.condition} • {testimonial?.timeframe}
              </p>
            </div>
          </div>

          <blockquote className="text-text-secondary italic mb-4">
            "{testimonial?.quote}"
          </blockquote>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={16} />
                <span>{testimonial?.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="ThumbsUp" size={16} />
                <span>{testimonial?.likes}</span>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" iconName="Share2" iconPosition="left">
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTestimonial;