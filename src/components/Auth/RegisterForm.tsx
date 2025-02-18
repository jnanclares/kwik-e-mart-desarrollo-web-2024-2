import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle } from 'lucide-react';

export const RegisterForm = () => {
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    securityPhrase: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulated registration - replace with actual implementation
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          securityPhrase: formData.securityPhrase,
          purchaseHistory: [],
        },
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Join Kwik-E-Mart Family</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="securityPhrase" className="block text-sm font-medium text-gray-700">
            Security Phrase (for password recovery)
          </label>
          <input
            type="text"
            id="securityPhrase"
            name="securityPhrase"
            value={formData.securityPhrase}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2D7337] focus:ring focus:ring-[#2D7337] focus:ring-opacity-50"
            placeholder="e.g., D'oh!"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#2D7337] text-white py-2 px-4 rounded-md hover:bg-[#236129] transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};