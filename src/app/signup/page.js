  'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import Agreement from '../agreement/page';
  import Image from "next/image";
  import Link from "next/link"
  import "../../styles/signup.css";
  import { validateEmail, validatePassword, validateUsername } from '../utils/validation';
  import { FaEye, FaEyeSlash, FaUser, FaEnvelope } from 'react-icons/fa';
  import { ClipLoader } from 'react-spinners';

  export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '', // Add this to ensure it is controlled from the start
    });
    const [showPopup, setShowPopup] = useState(false);
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
    
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    };
    
    const handleFocus = (e) => {
      if (e.target.name === "password") {
        setShowPopup(true);
      }
    };
    
    const handleBlur = (e) => {
      if (e.target.name === "password") {
        setShowPopup(false);
      }
    };

    const handleKeyDown = (e) => {
      const { name } = e.target;
    
      // Prevent space from being the first character
      if (e.key === ' ' && formData[name]?.length === 0) {
        e.preventDefault();
      }
    };

    const passwordRequirements = [
      { regex: /.{8,}/, message: "At least 8 characters" }, // At least 8 characters
      { regex: /[A-Z]/, message: "At least one uppercase letter" }, // At least one uppercase letter
      { regex: /[a-z]/, message: "At least one lowercase letter" }, // At least one lowercase letter
      { regex: /\d/, message: "At least one number" }, // At least one number
      { regex: /[!@#$%^&*(),.?":{}|<>]/, message: "At least one special character (!@#$%^&*)" }, // At least one special character
    ];
  
    const checkRequirements = (password) => {
      return passwordRequirements.map(({ regex, message }) => ({
        message,
        isValid: regex.test(password),
      }));
    };
  
    const passwordStatus = checkRequirements(formData.password);

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

    const [showAgreement, setShowAgreement] = useState(false);

const openAgreement = () => {
  setShowAgreement(true);
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

        <div className="left-part">
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
              onKeyDown={handleKeyDown}
            />
            <FaUser className='Fa' />
          </div>
          {formErrors.name && <p className="error-message side-error">{formErrors.name}</p>}
          <div className={`input-container ${formErrors.email ? 'error' : ''}`}>
            <input
              name="email"
              type="text"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"  
              onKeyDown={handleKeyDown}
            />
            <FaEnvelope className='Fa'/>
          </div>
          {formErrors.email && <p className="error-message side-error">{formErrors.email}</p>}
          <div className={`input-container ${formErrors.password ? 'error' : ''}`}>
            <input
              name="password"
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"  
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
              onKeyDown={handleKeyDown}
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
          {loading ? <ClipLoader size={24} color="#ffffff" /> : 'SIGN UP'}
          </button>
          
        </form>

        {showPopup && (
        <div className="password-popup">
          <p>Password must contain:</p>
          <ul>
            {passwordStatus.map(({ message, isValid }, index) => (
              <li key={index} className={isValid ? "valid" : "invalid"}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}

        {showAgreement && (
  <div className="terms-modal-overlay">
    <div className="terms-modal-content">
      <Agreement />
      <button className="terms-close-button" onClick={() => setShowAgreement(false)}>Close</button>
    </div>
  </div>
)}

<div className='agree-terms'>
  By signing up, you agree to our 
  <b>
    <span className="terms-link" onClick={openAgreement}>
       Terms of Service
    </span>
  </b>.
</div>
</div>
      </div>
    );
  }
