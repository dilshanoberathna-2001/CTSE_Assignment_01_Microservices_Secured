import React, { useState } from 'react';
import { api } from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password.length < 6) return toast.warn('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.register({ name, email, password });
      toast.success('Registration complete! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
         <img src="https://assets.nflxext.com/ffe/siteui/vlv3/4da5d2b1-1b22-498d-90c0-4d86701dffcc/98a1cb1e-5a1d-4b98-a46f-995272a632dd/US-en-20240129-popsignuptwoweeks-perspective_alpha_website_large.jpg" className="h-full w-full object-cover opacity-50 block filter grayscale" alt="Netflix Background" />
         <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>
      
      <div className="w-full m-auto z-10 p-6 lg:max-w-md">
        <div className="bg-black/80 px-10 py-16 rounded-lg backdrop-blur-sm shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8">Sign Up</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              {loading ? 'Validating...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
