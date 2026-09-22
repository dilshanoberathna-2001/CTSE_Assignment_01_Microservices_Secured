import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, PlayCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      api.getHistory(user.userId)
        .then(async (res) => {
          const rawHistory = res.data;
          // Hydrate history with movie details
          const moviePromises = rawHistory.map(item => 
             api.getMovieById(item.movieId).catch(() => null)
          );
          const results = await Promise.all(moviePromises);
          
          const hydratedHistory = rawHistory.map((item, index) => {
             const movieData = results[index]?.data;
             return movieData ? { ...item, movie: movieData } : null;
          }).filter(Boolean); // removes nulls if movie was deleted

          setHistory(hydratedHistory);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="pt-28 pb-12 px-6 lg:px-12 bg-dark min-h-screen text-white">
      <div className="flex items-center space-x-4 mb-8">
        <h2 className="text-3xl font-bold">Viewing History</h2>
        <HistoryIcon size={28} className="text-gray-400" />
      </div>

      {loading ? (
        <div className="flex justify-center mt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <Clock size={48} className="mb-4 opacity-50" />
          <p className="text-xl">You haven't watched anything yet.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 max-w-5xl mx-auto">
          {history.map(item => (
            <div key={item._id} className="flex bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:bg-gray-800 transition duration-300 shadow-md">
              <Link to={`/play/${item.movieId}`} className="hidden md:block w-48 flex-shrink-0 relative group">
                <img src={item.movie.backdropUrl || item.movie.thumbnailUrl} alt={item.movie.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                   <PlayCircle className="text-white fill-current opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow" size={40} />
                </div>
              </Link>
              <div className="p-4 md:p-6 flex flex-col justify-between w-full relative">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1">{item.movie.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">Watched on {new Date(item.watchedAt).toLocaleDateString()}</p>
                  <p className="text-gray-300 text-sm md:text-md line-clamp-2 md:w-4/5">{item.movie.description}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="w-2/3 md:w-1/2">
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.status === 'completed' ? 'bg-netflix' : 'bg-green-500'}`} style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold uppercase mt-1 inline-block">
                      {item.status === 'completed' ? 'Finished' : `${item.progress}% Completed`}
                    </span>
                  </div>
                  <Link to={`/play/${item.movieId}`} className="md:hidden bg-white text-black px-4 py-2 rounded font-bold text-sm">Play</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
