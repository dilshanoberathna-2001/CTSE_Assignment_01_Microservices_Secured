import React, { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';
import { Search, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.getMovies();
      setMovies(res.data);
    } catch (err) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchMovies();
      return;
    }
    setLoading(true);
    try {
      const res = await api.searchMovies(searchQuery);
      setMovies(res.data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 bg-dark min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h2 className="text-3xl font-bold mb-6 md:mb-0 hidden md:block">TV Shows & Movies</h2>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-1/3 flex items-center">
          <Search className="absolute left-4 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search titles, characters, or genres..." 
            className="w-full bg-gray-800/80 border border-gray-600 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center mt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.length > 0 ? movies.map(movie => (
            <Link 
              key={movie._id} 
              to={`/movies/${movie._id}`} 
              className="relative group rounded-md overflow-hidden transform transition duration-300 hover:scale-105 hover:z-10 shadow-lg cursor-pointer"
            >
              <img 
                src={movie.thumbnailUrl} 
                alt={movie.title} 
                className="w-full h-auto min-h-[220px] object-cover border border-gray-800"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="font-bold text-sm md:text-md mb-1">{movie.title}</span>
                <span className="text-xs text-gray-300">{movie.genre}</span>
              </div>
            </Link>
          )) : (
            <div className="col-span-full mt-20 text-center text-gray-400">
              <p className="text-xl">Your search for "{searchQuery}" did not have any matches.</p>
              <p className="mt-2 text-sm">Suggestions: Try different keywords or check spelling.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;
