'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import "../../styles/login.css"; 
import { validateEmail, validatePassword, validateFullName } from '../utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  // Submit form for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFormErrors({});
    setLoading(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      // Redirect to the dashboard or home page
      router.push('/');
    } catch (err) {
      setError(err.message); // Show the error from the API response
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="right-panel">
        <h2> Hi, Welcome! </h2>
        <p>Sign up to create an account.</p>
        <button
          onClick={() => router.push('/signup')}
        >
          Create Account
        </button>
      </div>

      <form className="left-form" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}
        <Image
          src="/studbud-logo.svg"
          alt="Studbud Logo"
          width={100}
          height={100}
        />
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your StudBud account
        </h2>
        <div className="mt-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
        </div>
        <div className="mt-4">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 mt-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
