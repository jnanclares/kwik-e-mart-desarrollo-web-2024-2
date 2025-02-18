import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle } from 'lucide-react';

export const LoginForm = () => {
  const { dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulated login - replace with actual authentication
      if (email === 'homer@springfield.com' && password === 'doughnuts') {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            id: '1',
            name: 'Homer Simpson',
            email: 'homer@springfield.com',
            purchaseHistory: [],
          },
        });
      } else {
        throw new Error('D\'oh! Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back to Kwik-E-Mart</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#2D7337] text-white py-2 px-4 rounded-md hover:bg-[#236129] transition-colors"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <a href="#" className="text-sm text-[#2D7337] hover:underline">
          Forgot your password? D'oh!
        </a>
      </div>
    </div>
  );
};