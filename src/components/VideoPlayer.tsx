import type { FC } from 'react';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ url }) => {
  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
      
      // Rutube
      if (urlObj.hostname.includes('rutube.ru')) {
        return urlObj.pathname.split('/').pop();
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const videoId = getVideoId(url);
  if (!videoId) return null;

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return (
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  if (url.includes('rutube.ru')) {
    return (
      <div className="aspect-video">
        <iframe
          src={`https://rutube.ru/play/embed/${videoId}`}
          title="Rutube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  return null;
}; 