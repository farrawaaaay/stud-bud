'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter hook

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpVerified, setOtpVerified] = useState(false); // State to track OTP verification
  const router = useRouter();  // Initialize the router
  const { email } = router.query;  // Access the email query parameter

  useEffect(() => {
    // Check if email is available in the query parameter
    if (!email) {
      setError('Email not found');
    }
  }, [email]); // Run this effect whenever `email` changes

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate OTP verification (can replace with actual OTP verification)
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      setOtpVerified(true);  // OTP is verified, now allow setting a new password
      setMessage(data.message); // Success message
    } catch (err) {
      setError(err.message); // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setMessage(data.message); // Success message

      // Redirect to login page after successful reset
      router.push('/login');
    } catch (err) {
      setError(err.message); // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Enter the OTP sent to your email and your new password.</p>

      {/* OTP Form */}
      {!otpVerified ? (
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      ) : (
        // New Password Form (only appears after OTP is verified)
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting password...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}
