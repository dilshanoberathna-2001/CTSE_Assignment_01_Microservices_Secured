import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { ArrowLeft, Maximize } from 'lucide-react';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streamInfo, setStreamInfo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.startPlayback({ movieId: id })
      .then(res => {
        setStreamInfo(res.data.streamInfo);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate('/');
      });
  }, [id, navigate]);

  useEffect(() => {
    // Simulate playing metadata telemetry mapping back to DB
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          handleComplete();
          return 100;
        }
        api.saveHistory({ movieId: id, progress: next }).catch(console.error);
        return next;
      });
    }, 4000); // increase 5% every 4 secs for fast demo purposes

    return () => clearInterval(interval);
  }, [id]);

  const handleComplete = async () => {
    try {
      await api.completeMovie({ movieId: id });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
     return <div className="h-screen bg-black flex justify-center items-center text-netflix text-2xl font-bold animate-pulse">Loading Stream...</div>;
  }
  if (!streamInfo) return null;

  return (
    <div className="w-full h-screen bg-black text-white relative flex flex-col justify-center">
      {/* HUD (Heads Up Display) overlay */}
      <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent z-50 flex items-center hover:opacity-100 opacity-0 transition-opacity duration-300 group">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-300">
           <ArrowLeft size={32} />
        </button>
        <span className="ml-4 font-bold text-xl drop-shadow">{streamInfo.title}</span>
      </div>

      <div className="w-full h-full flex justify-center items-center">
        {streamInfo.trailerUrl && streamInfo.trailerUrl.includes('youtube') ? (
            <iframe 
                className="w-full h-full pointer-events-none" 
                src={`${streamInfo.trailerUrl}?autoplay=1&controls=0&mute=0&modestbranding=1&rel=0&showinfo=0`} 
                title={streamInfo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        ) : (
            <video className="w-full h-full" autoPlay controls controlsList="nodownload">
               <source src={streamInfo.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
            </video>
        )}
      </div>

      {/* Progress Telemetry Demo (Hidden mostly, aesthetic purpose) */}
      <div className="absolute bottom-10 left-10 text-gray-500 font-mono text-xs opacity-50 z-50">
        <p>TELEMETRY DETECTED</p>
        <p>Simulation Progress: {progress}%</p>
        <div className="w-48 h-1 bg-gray-800 mt-1">
           <div className="bg-netflix h-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Player;
