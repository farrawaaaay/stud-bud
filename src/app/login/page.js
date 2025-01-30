'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import "../../styles/login.css";
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const MAX_ATTEMPTS = 3;
  const COOLDOWN_TIME = 30000; // 30 seconds in milliseconds

  useEffect(() => {
    const storedAttempts = localStorage.getItem('failedAttempts');
    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  useEffect(() => {
    if (failedAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setCooldown(COOLDOWN_TIME);
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1000);
      }, 1000);
      const timeout = setTimeout(() => {
        setIsLocked(false);
        setFailedAttempts(0);
        localStorage.removeItem('failedAttempts');
        clearInterval(timer);
      }, COOLDOWN_TIME);
      return () => {
        clearTimeout(timeout);
        clearInterval(timer);
      };
    }
  }, [failedAttempts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleKeyDown = (e) => {
    const { name } = e.target;
  
    // Prevent space from being the first character
    if (e.key === ' ' && formData[name]?.length === 0) {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Input username';
    if (!formData.password) errors.password = 'Input password';
    return errors;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;

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
  
      if (res.status !== 200) {
        setError(data.error || 'Login failed');
        setFailedAttempts((prev) => {
          const newAttempts = prev + 1;
          localStorage.setItem('failedAttempts', newAttempts.toString());
          return newAttempts;
        });
        setLoading(false);
        return;
      }
  
      // Store token and user data in localStorage
      localStorage.setItem('token', data.token); // Store token
      localStorage.setItem('user', JSON.stringify({
        _id: data.student._id,
        name: data.student.name,
        profilePicture: data.student.profilePicture,
        email: data.student.email,
      }));
  
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      localStorage.removeItem('failedAttempts');
  
      router.push('/workspace');
    } catch (err) {
      console.error(err); // Log error for debugging
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="log-in-container">
      <div className="left-panel">
        <Image
          src="/studbud-darkmode.svg"
          height={100}
          width={100}
          alt="studbud logo"
        />
        <h2>Welcome Back!</h2>
        <p>Maintain your productivity by visiting us regularly and staying on track.</p>
        <p>
          No account yet? Let’s fix that—<b><Link href="/signup" className="little-link">sign up</Link></b> now!
        </p>
      </div>

      <form className="right-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        {isLocked && (
          <p className="error-message">
            Too many failed attempts. Please try again in {Math.ceil(cooldown / 1000)} seconds.
          </p>
        )}
        <div className={`input-container ${formErrors.name ? 'error' : ''}`}>
          <input
            name="name"
            type="text"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off" 
            onKeyDown={handleKeyDown} 
            disabled={isLocked}
          />
          <FaUser className='Fa' />
        </div>
        {formErrors.name && <p className="error-message side-error">{formErrors.name}</p>}
        <div className={`input-container ${formErrors.password ? 'error' : ''}`}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off" 
            onKeyDown={handleKeyDown} 
            disabled={isLocked}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={isLocked}
          >
            {showPassword ? <FaEyeSlash className='Fa'/> : <FaEye className='Fa'/>}
          </button>
        </div>
        {formErrors.password && <p className="error-message side-error">{formErrors.password}</p>}
        
        <button className="submit-button" type="submit" disabled={loading || isLocked}>
          {loading ? <ClipLoader size={24} color="#ffffff" /> : 'SIGN IN'}
        </button>
      </form>
    </div>
  );
}