import React, { useState, useContext } from 'react';
import { api } from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      login(res.data.userId, res.data.token);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
         <img src="https://assets.nflxext.com/ffe/siteui/vlv3/4da5d2b1-1b22-498d-90c0-4d86701dffcc/98a1cb1e-5a1d-4b98-a46f-995272a632dd/US-en-20240129-popsignuptwoweeks-perspective_alpha_website_large.jpg" className="h-full w-full object-cover opacity-50 block" alt="Netflix Background" />
         <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>
      
      <div className="w-full m-auto z-10 p-6 lg:max-w-md">
        <div className="bg-black/80 px-10 py-16 rounded-lg backdrop-blur-sm shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8">Sign In</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold text-white bg-netflix hover:bg-netflixHover px-4 py-3 rounded-md transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-gray-400">
            New to StreamLite?{' '}
            <Link to="/register" className="text-white hover:underline">
              Sign up now.
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed tracking-wide">
            This page is protected by invisible reCAPTCHA to ensure you're not a bot. 
            <span className="text-blue-500 hover:underline cursor-pointer"> Learn more.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
