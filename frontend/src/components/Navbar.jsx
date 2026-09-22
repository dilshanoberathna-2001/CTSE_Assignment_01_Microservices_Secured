import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, User, Search, History as HistoryIcon, LogOut, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-md py-4' : 'bg-gradient-to-b from-black/80 to-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-netflix font-extrabold text-3xl tracking-wider">StreamLite</Link>
          {user && (
            <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
              <Link to="/movies" className="hover:text-white transition-colors duration-200">Movies</Link>
              <Link to="/watchlist" className="hover:text-white transition-colors duration-200">Watchlist</Link>
              <Link to="/history" className="hover:text-white transition-colors duration-200">History</Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-6 text-gray-300">
          <Link to="/movies" className="hover:text-white"><Search size={20} /></Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/watchlist" className="hover:text-white" title="Watchlist"><Bookmark size={20} /></Link>
              <button onClick={handleLogout} className="flex items-center hover:text-white transition-colors" title="Logout">
                <LogOut size={20} className="mr-1" />
              </button>
              <div className="w-8 h-8 rounded-md bg-netflix text-white flex items-center justify-center font-bold">
                {user.role ? user.role.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 bg-transparent text-white border border-gray-600 rounded hover:border-white transition-all">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-netflix text-white rounded font-medium hover:bg-netflixHover transition-all">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
