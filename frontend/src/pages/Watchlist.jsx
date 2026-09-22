import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Play, X, BookmarkCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      api.getWatchlist(user.userId)
        .then(async (res) => {
          // Watchlist only stores _id. Need to fetch full movie details for UI
          const moviePromises = res.data.map(item => api.getMovieById(item.movieId).catch(() => null));
          const movieResults = await Promise.all(moviePromises);
          
          const validMovies = movieResults
            .filter(r => r && r.data)
            .map(r => r.data);
            
          setWatchlist(validMovies);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleRemove = async (movieId, e) => {
    e.preventDefault(); // Prevent navigating to movie details
    try {
      await api.removeFromWatchlist(user.userId, movieId);
      setWatchlist(watchlist.filter(item => item._id !== movieId));
      toast.info('Removed from My List');
    } catch (err) {
      toast.error('Could not remove item');
    }
  };

  return (
    <div className="pt-28 pb-12 px-6 lg:px-12 bg-dark min-h-screen text-white">
      <div className="flex items-center space-x-3 mb-10">
        <h2 className="text-3xl font-bold">My List</h2>
        <BookmarkCheck size={28} className="text-netflix" />
      </div>

      {loading ? (
        <div className="flex justify-center mt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix"></div>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <BookmarkCheck size={64} className="mb-6 opacity-30" />
          <p className="text-2xl font-bold mb-2 text-white">Your list is lonely</p>
          <p className="text-lg">Add movies and shows you want to watch later here.</p>
          <Link to="/movies" className="mt-8 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-300 transition">
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map(movie => (
             <Link 
              key={movie._id} 
              to={`/movies/${movie._id}`} 
              className="relative group rounded-md overflow-hidden transform transition duration-300 hover:scale-105 hover:z-10 shadow-lg cursor-pointer max-w-[250px]"
            >
              <img 
                src={movie.thumbnailUrl} 
                alt={movie.title} 
                className="w-full h-auto min-h-[220px] object-cover border border-gray-800"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
                 <button onClick={(e) => handleRemove(movie._id, e)} className="absolute top-2 right-2 text-white hover:text-netflix p-1 bg-black/50 rounded-full transition-colors">
                    <X size={20} />
                 </button>
                 <Play className="text-white fill-current w-12 h-12 hover:scale-110 transition-transform mb-2" />
                 <span className="font-bold text-center px-2">{movie.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
