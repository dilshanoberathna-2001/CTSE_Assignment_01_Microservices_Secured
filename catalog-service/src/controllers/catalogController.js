const axios = require('axios');
const Movie = require('../models/Movie');

const OMDB_API_KEY = process.env.OMDB_API_KEY || '9809f384';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

const mapOMDBMovie = (movie) => {
  // Extract high-res image if possible by modifying IMDB's resizing param
  const highResPoster = movie.Poster && movie.Poster !== 'N/A' 
    ? movie.Poster.replace('SX300', 'SX1920') 
    : 'https://via.placeholder.com/300x450.png?text=No+Image';

  return {
    _id: movie.imdbID, // Using IMDb ID as our unique identifier
    title: movie.Title,
    description: movie.Plot || 'No description available.',
    genre: movie.Genre || 'General',
    thumbnailUrl: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Image',
    backdropUrl: highResPoster, // High resolution fallback for hero banners
    trailerUrl: 'https://www.youtube.com/embed/1B9Z529s5D4', // Placeholder (OMDb doesn't provide trailers)
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',  // Placeholder for playback
    duration: movie.Runtime ? parseInt(movie.Runtime) : 120, 
    rating: movie.imdbRating ? parseFloat(movie.imdbRating) : 0,
    isAvailable: true
  };
};

exports.addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json({ message: 'Movie added locally successfully', movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    // OMDb API does not have a "trending" endpoint. We need to search generic popular terms to build a catalog.
    // Let's combine a few searches to get a diverse list of movies.
    const searchTerms = ['avengers', 'batman', 'matrix', 'star wars', 'spider-man'];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const response = await axios.get(`${OMDB_BASE_URL}?s=${encodeURIComponent(randomTerm)}&type=movie&apikey=${OMDB_API_KEY}`);
    
    if (response.data.Response === 'False') {
      return res.json([]); // No movies found
    }

    // OMDb search only returns basic info (Title, Year, imdbID, Type, Poster).
    // To get details like duration, genre, and description for cards, we'd need to fetch each by ID.
    // For performance on the grid, we will just map what's available here. Detailed info fetches on `/movies/:id`.
    const movies = response.data.Search.map(movie => {
      const highRes = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster.replace('SX300', 'SX1920') : '';
      return {
        _id: movie.imdbID,
        title: movie.Title,
        description: 'Click for details...', // Placeholder until fetched by ID
        genre: 'Movie',
        thumbnailUrl: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Image',
        backdropUrl: highRes,
        trailerUrl: 'https://www.youtube.com/embed/1B9Z529s5D4',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 120,
        rating: 0,
        isAvailable: true
      }
    });

    res.json(movies);
  } catch (error) {
    console.error('OMDb API Error:', error.message);
    try {
      const localMovies = await Movie.find();
      res.json(localMovies);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch movies', error: err.message });
    }
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    // For manual local db entries fallback
    if (movieId.length === 24) { 
        const dbMovie = await Movie.findById(movieId);
        if (dbMovie) return res.json(dbMovie);
    }

    // Try OMDb API by ID (i=tt...)
    const response = await axios.get(`${OMDB_BASE_URL}?i=${movieId}&apikey=${OMDB_API_KEY}&plot=full`);
    const omdbData = response.data;

    if (omdbData.Response === 'False') {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movie = mapOMDBMovie(omdbData);
    res.json(movie);
  } catch (error) {
    console.error('OMDb Fetch Details Error:', error.message);
    res.status(404).json({ message: 'Movie not found' });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return this.getAllMovies(req, res); // Return default random mix if no query
    }

    const response = await axios.get(`${OMDB_BASE_URL}?s=${encodeURIComponent(q)}&type=movie&apikey=${OMDB_API_KEY}`);
    
    if (response.data.Response === 'False') {
      return res.json([]); // Return empty array if not found
    }

    const movies = response.data.Search.map(movie => {
      const highRes = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster.replace('SX300', 'SX1920') : '';
      return {
        _id: movie.imdbID,
        title: movie.Title,
        description: 'Click for details...',
        genre: 'Movie',
        thumbnailUrl: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450.png?text=No+Image',
        backdropUrl: highRes,
        trailerUrl: 'https://www.youtube.com/embed/1B9Z529s5D4',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: 120,
        rating: 0,
        isAvailable: true
      }
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

exports.getStreamInfo = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    // First let's get standard OMDb details
    const response = await axios.get(`${OMDB_BASE_URL}?i=${movieId}&apikey=${OMDB_API_KEY}`).catch(() => null);
    
    if (response && response.data.Response !== 'False') {
       const mapped = mapOMDBMovie(response.data);
       return res.json({
         movieId: mapped._id,
         title: mapped.title,
         trailerUrl: mapped.trailerUrl,
         videoUrl: mapped.videoUrl,
         duration: mapped.duration,
         isAvailable: true
       });
    }

    // Fallback to local DB search length
    if (movieId.length === 24) {
      const localMovie = await Movie.findById(movieId);
      if (localMovie) {
        return res.json({
          movieId: localMovie._id,
          title: localMovie.title,
          trailerUrl: localMovie.trailerUrl,
          videoUrl: localMovie.videoUrl,
          duration: localMovie.duration,
          isAvailable: localMovie.isAvailable
        });
      }
    }

    return res.status(404).json({ message: 'Stream info not found' });
  } catch (error) {
    res.status(500).json({ message: 'API Error', error: error.message });
  }
};
