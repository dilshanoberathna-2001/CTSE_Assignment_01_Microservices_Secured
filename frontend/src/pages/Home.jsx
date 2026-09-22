import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';
import { Play, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const MovieRow = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetchUrl();
        // Since OMDb array might have invalid items or duplicates
        const validMovies = Array.isArray(req.data) ? req.data.filter(m => m.thumbnailUrl) : [];
        // Optional: filter out duplicates if OMDb search returned them
        const unique = Array.from(new Map(validMovies.map(item => [item._id, item])).values());
        setMovies(unique);
      } catch (err) {
        console.error("Failed fetching movie row", err);
      }
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="ml-[4%] my-8 relative group">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">{title}</h2>
      
      <div 
        ref={rowRef} 
        className="flex space-x-4 overflow-y-hidden overflow-x-scroll hide-scrollbar py-4 px-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {movies.map(movie => (
          <Link to={`/movies/${movie._id}`} key={movie._id} className="relative flex-none transform transition-transform duration-300 hover:scale-110 hover:z-10 cursor-pointer w-40 md:w-52 h-auto rounded-lg shadow-lg">
            <img
              src={isLargeRow && movie.backdropUrl ? movie.backdropUrl : movie.thumbnailUrl}
              alt={movie.title}
              className={`rounded-lg object-cover ${isLargeRow ? 'h-[250px] md:h-[350px]' : 'h-[160px] md:h-[220px]'} w-full border border-gray-800 hover:border-white/50 shadow-2xl`}
              loading="lazy"
            />
            {/* Dark gradient overlay + Title on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 rounded-lg">
              <span className="font-bold text-sm md:text-base text-white drop-shadow-md">{movie.title}</span>
            </div>
          </Link>
        ))}
        {movies.length === 0 && <div className="text-gray-500 animate-pulse w-full h-32 flex items-center">Loading row...</div>}
      </div>
    </div>
  );
};

const Home = () => {
  const [randomMovie, setRandomMovie] = useState(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const { data } = await api.getMovies();
        if (data && data.length > 0) {
           const heroMovie = data[Math.floor(Math.random() * data.length)];
           // Fetch deep details to get actual Plot & high-res rating (since getAll returns shallow data for OMDb)
           const detailedReq = await api.getMovieById(heroMovie._id);
           setRandomMovie(detailedReq.data);
        }
      } catch (err) {
        toast.error('Could not fetch hero movie');
      }
    }
    fetchBanner();
  }, []);

  return (
    <div className="bg-dark text-white pb-12 w-full overflow-x-hidden">
      {/* Hero Banner Section */}
      <header className="relative w-full min-h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        
        {/* Blurry Background (Stretched Portrait Poster fix) */}
        {randomMovie && (
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[30px] scale-110 opacity-40"
               style={{ backgroundImage: `url("${randomMovie.thumbnailUrl}")` }}
             ></div>
             {/* Gradient dark overlays */}
             <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-transparent w-full md:w-3/4"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/50"></div>
          </div>
        )}

        <div className="relative z-10 w-full px-[6%] pt-24 md:pt-0 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Hero Content (Left side on Desktop) */}
          <div className="w-full md:w-1/2 flex flex-col animate-fade-in-up">
            {randomMovie ? (
              <>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-2xl font-serif text-white tracking-tight">
                  {randomMovie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-300 font-bold mb-6">
                  {randomMovie.rating > 0 && (
                    <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded">
                      IMDb {randomMovie.rating}
                    </span>
                  )}
                  <span className="bg-gray-800/80 px-2 py-1 rounded">{randomMovie.duration} min</span>
                  <span className="border border-gray-500 px-3 py-1 rounded-full">{randomMovie.genre}</span>
                </div>
                
                <p className="text-base md:text-lg lg:text-xl font-medium max-w-xl text-gray-300 drop-shadow-md mb-8 leading-relaxed line-clamp-3 md:line-clamp-4">
                  {randomMovie.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to={`/play/${randomMovie._id}`} className="bg-white text-black px-6 py-3 rounded-lg font-bold text-base md:text-lg flex items-center justify-center hover:bg-gray-300 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <Play className="fill-black mr-2" size={22} /> Play
                  </Link>
                  <Link to={`/movies/${randomMovie._id}`} className="bg-gray-600/60 backdrop-blur-md border border-gray-500/50 text-white px-6 py-3 rounded-lg font-bold text-base md:text-lg flex items-center justify-center hover:bg-gray-500/80 transition-colors shadow-lg">
                    <Info className="mr-2" size={22} /> More Info
                  </Link>
                </div>
              </>
            ) : (
              <div className="animate-pulse flex flex-col space-y-4">
                <div className="h-16 bg-gray-700/50 w-3/4 rounded-lg"></div>
                <div className="h-24 bg-gray-700/50 w-full rounded-lg"></div>
                <div className="flex gap-4">
                  <div className="h-14 w-36 bg-gray-600/50 rounded-lg"></div>
                </div>
              </div>
            )}
          </div>

          {/* Hero Poster Art (Right side on Desktop - Hidden on small mobile to save space, but visible on tablets) */}
          <div className="hidden sm:flex w-full md:w-1/3 justify-center md:justify-end items-center px-4 relative">
             {randomMovie ? (
               <div className="relative group">
                 {/* Decorative glow behind poster */}
                 <div className="absolute -inset-1 bg-gradient-to-r from-netflix to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                 <img 
                   src={randomMovie.backdropUrl || randomMovie.thumbnailUrl} 
                   alt={randomMovie.title} 
                   className="relative z-10 w-48 md:w-64 lg:w-[320px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-gray-700 object-cover transform transition-transform duration-500 group-hover:scale-105"
                 />
               </div>
             ) : (
               <div className="animate-pulse bg-gray-800 w-48 md:w-64 lg:w-[320px] aspect-[2/3] rounded-xl shadow-2xl border border-gray-700"></div>
             )}
          </div>

        </div>

        {/* Fading bottom gradient blending into rows */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dark to-transparent z-10"></div>
      </header>

      {/* Content Rows */}
      <div className="z-20 relative -mt-10 md:-mt-20">
        <MovieRow title="Critically Acclaimed" fetchUrl={api.getMovies} isLargeRow={true} />
        <MovieRow title="Trending Blockbusters" fetchUrl={api.getMovies} false />
        <MovieRow title="Action Packed" fetchUrl={() => api.searchMovies('Action')} false />
        <MovieRow title="Sci-Fi & Fantasy" fetchUrl={() => api.searchMovies('Sci-Fi')} false />
        <MovieRow title="Comedy Specials" fetchUrl={() => api.searchMovies('Comedy')} false />
      </div>
    </div>
  );
};

export default Home;
