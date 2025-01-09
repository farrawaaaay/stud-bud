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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    return errors;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

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
  
      if (res.status !== 200) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
  
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        _id: data.student._id,
        name: data.student.name,
        profilePicture: data.student.profilePicture, 
        email:data.student.email,
      }));
  
      router.push('/workspace');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container">
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
        <div className={`input-container ${formErrors.name ? 'error' : ''}`}>
          <input
            name="name"
            type="text"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"  
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
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash className='Fa'/> : <FaEye className='Fa'/>}
          </button>
        </div>
        {formErrors.password && <p className="error-message side-error">{formErrors.password}</p>}
        <Link href="/forgot-password">Forgot Password?</Link>
        
        <button className="submit-button" type="submit" disabled={loading}>
          {isClient && loading ? <ClipLoader size={24} color="#ffffff" /> : 'SIGN IN'}
        </button>
      </form>
    </div>
  );
}
