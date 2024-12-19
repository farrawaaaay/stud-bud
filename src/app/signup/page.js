'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import "../../styles/login.css"
import { validateEmail, validatePassword, validateFullName } from '../utils/validation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
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
    if (validateFullName(formData.name)) errors.name = validateFullName(formData.name);
    if (validateEmail(formData.email)) errors.email = validateEmail(formData.email);
    if (validatePassword(formData.password)) errors.password = validatePassword(formData.password);
    return errors;
  };

  // Submit form
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      // Redirect to login page
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Already have a StudBud account?
        </h2>
        <p>Sign in to access your account.</p>
        <button
          onClick={() => router.push('/login')}
          className="go-to-signin w-full p-2 mt-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Go to Sign In
        </button>
      </div>
        

        <form className="right-form" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <Image
            src="/studbud-logo.svg"
            alt="Studbud Logo"
            width={100}
            height={100}
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your StudBud account
        </h2>
          <div>
            <input
              name="name"
              type="text"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
          </div>
          <div>
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
          <div>
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
            className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    
  );
}
