  'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import Image from "next/image";
  import Link from "next/link"
  import "../../styles/signup.css";
  import { validateEmail, validatePassword, validateUsername } from '../utils/validation';
  import { FaEye, FaEyeSlash, FaUser, FaEnvelope } from 'react-icons/fa';

  export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '', // Add this to ensure it is controlled from the start
    });
    
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

    // Validate form inputs
    const validateForm = () => {
      const errors = {};
      if (validateUsername(formData.name)) errors.name = validateUsername(formData.name);
      if (validateEmail(formData.email)) errors.email = validateEmail(formData.email);
      if (validatePassword(formData.password)) errors.password = validatePassword(formData.password);
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
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
        <div className="right-panel">
          <Image
              src="/studbud-darkmode.svg"
              height={100}
              width={100}
              alt="studbud logo"
            />
            <h2>Hi, Welcome!</h2>
            <br></br>
            <p>Share your details to get started, and unlock access to our amazing tools.</p>
            <br></br><br></br><br></br>
            <p>
              Already have an account?<b><Link href="/login" className="little-link"> Click here</Link></b>!
            </p>
        </div>

        <form className="left-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <h2> Register </h2>
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
          <div className={`input-container ${formErrors.name ? 'error' : ''}`}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"  
            />
            <FaEnvelope className='Fa'/>
          </div>
          {formErrors.email && <p className="error-message side-error">{formErrors.email}</p>}
          <div className={`input-container ${formErrors.name ? 'error' : ''}`}>
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
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash className='Fa'/> : <FaEye className='Fa'/>}
            </button>
          </div>
          {formErrors.password && <p className="error-message side-error">{formErrors.password}</p>}
          <div className={`input-container ${formErrors.confirmPassword ? 'error' : ''}`}>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="off"  
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash className='Fa'/> : <FaEye className='Fa'/>}
            </button>
          </div>
          {formErrors.confirmPassword && <p className="error-message side-error">{formErrors.confirmPassword}</p>}

          <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'SIGN UP'}
          </button>
          <p>By signing up, you agree to our <b><Link href="/terms-of-service">Terms of Service.</Link></b></p>
        </form>
      </div>
    );
  }
