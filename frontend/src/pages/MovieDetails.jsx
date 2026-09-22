import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Play, Plus, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getMovieById(id).then(res => {
      setMovie(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      toast.error('Error fetching movie details');
      setLoading(false);
    });

    if (user) {
      api.checkWatchlist(user.userId, id)
        .then(res => setIsSaved(res.data.isSaved))
        .catch(console.error);
    }
  }, [id, user]);

  const handleWatchlistToggle = async () => {
    try {
      if (isSaved) {
        await api.removeFromWatchlist(user.userId, id);
        setIsSaved(false);
        toast.info('Removed from Watchlist');
      } else {
        await api.addToWatchlist({ movieId: id });
        setIsSaved(true);
        toast.success('Added to Watchlist');
      }
    } catch (err) {
      toast.error('Failed to update watchlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-netflix"></div>
      </div>
    );
  }

  if (!movie) return <div className="text-white text-center mt-32 text-2xl">Movie completely unavailable.</div>;

  return (
    <div className="w-full bg-dark text-white min-h-screen relative overflow-hidden">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 w-full h-[60vh] md:h-[80vh] opacity-30 z-0">
        <img 
          src={movie.backdropUrl || movie.thumbnailUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 duration-200" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Poster */}
          <div className="hidden md:block w-1/3 max-w-[340px] flex-shrink-0 animate-fade-in-up">
            <img 
              src={movie.thumbnailUrl} 
              alt={movie.title} 
              className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-800"
            />
          </div>

          {/* Details Content */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight shadow-black drop-shadow-lg">{movie.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6 text-sm font-semibold">
              <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded">{movie.rating * 10}% Match</span>
              <span className="text-gray-300">{movie.duration} Minutes</span>
              <span className="border border-gray-600 text-gray-400 px-3 py-1 rounded-full">{movie.genre}</span>
            </div>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mb-10 drop-shadow-md">
              {movie.description}
            </p>

            <div className="flex items-center gap-4">
              <Link 
                to={`/play/${movie._id}`} 
                className="bg-netflix hover:bg-netflixHover text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center transition-all transform hover:scale-105 shadow-xl"
              >
                <Play className="fill-current mr-2" size={24} /> Play Now
              </Link>
              
              {user ? (
                <button 
                  onClick={handleWatchlistToggle} 
                  className="bg-gray-800/80 backdrop-blur-md border border-gray-600 hover:border-white text-white w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg group"
                  title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  {isSaved ? <Check size={26} className="text-green-500 group-hover:text-red-500" /> : <Plus size={26} />}
                </button>
              ) : (
                <div className="text-gray-400 text-sm ml-4">
                  <Link to="/login" className="text-white font-medium hover:underline">Sign In</Link> to save to watchlist.
                </div>
              )}
            </div>

            {/* Optional Trailer/Video details here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
