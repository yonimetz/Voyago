 import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', { username, email, password });
      setCurrentUser(response.data);
      navigate('/');
    } catch (err) {
      setError('Registration failed. Username or email might be taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-200">
        <h2 className="text-4xl font-black text-center text-blue-600 mb-2">Voyago</h2>
        <p className="text-slate-500 text-center font-medium mb-8">Join the adventure! Create an account.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
            <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
            <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
            <input type="password" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl">
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Already have an account? 
          <Link to="/login" className="ml-2 text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;