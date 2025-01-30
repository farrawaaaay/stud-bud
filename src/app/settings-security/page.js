'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import "../../styles/workspace.css";
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState({ name: '', profilePic: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  const handleNavigation = (label) => {
    switch (label) {
      case 'Workspace':
        router.push('/workspace');
        break;
      case 'Help':
        router.push('/help');
        break;
      case 'Logout':
        // Add your logout logic here, such as clearing tokens or redirecting
        router.push('/logout');
        break;
      default:
        break;
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
  
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('User not logged in. Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
  
    const { email } = JSON.parse(storedUser);
    try {
      const response = await fetch('/api/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, currentPassword, newEmail }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || 'Failed to change email');
        return;
      }
  
      setSuccess('Email changed successfully!');
      setNewEmail('');
      setCurrentPassword('');
  
      // Clear user data from localStorage and logout
      localStorage.removeItem('user');
      setTimeout(() => {
        router.push('/login'); // Redirect to login page
      }, 2000);
  
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    }
  };
  

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError('User not logged in. Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const { email } = JSON.parse(storedUser); // Extract email from stored user data
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to change password');
        return;
      }

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
    }
  };


  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser); 
        setUser(user); 
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login'); 
      }
    } else {
      router.push('/login'); 
    }
  }, [router]);

  const handleSecurityClick = () => {
    router.push('/settings');
  };

  return (
    <div className="workspace-container">
      <div className="up-logo">
        <Image src="/studbud-logo.svg" alt="logo" width={80} height={80} />
        <div className="title-container">
        <h1>PROFILE</h1>
        </div>
        
        <div className={`profile-container ${isProfileOpen ? "open" : ""}`}>
          <div className={`profile-details ${isProfileOpen ? "open" : ""}`}>
            <div className="profile-icon">
              <div className="profile">
                <Image
                  src={user.profilePicture || 'https://res.cloudinary.com/dvorbtw7b/image/upload/v1735892282/StudBud/default_profile.svg'}
                  width={60}
                  height={60}
                  alt="Profile Icon"
                />
              </div>
              <span className="username">{user.name}</span>
            </div>
            
            {isProfileOpen && (
              <div className="options">
                <ul>
                  {[{ icon: "/home.svg", label: "Workspace" },
                    { icon: "/logout.svg", label: "Logout" }].map((item, index) => (
                      <li key={index} onClick={() => handleNavigation(item.label)}>
                        <Image
                          src={item.icon}
                          alt={`${item.label.toLowerCase()} icon`}
                          width={30}
                          height={30}
                        />
                        {item.label}
                      </li>
                    ))}
                </ul>
              </div>
            )}

          </div>
          <button className="toggleBtn" onClick={toggleProfile}>
            {isProfileOpen ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <div className="main-workspace">
        <div className="settings-sidebar">
        <div className="settings-title">
        <Image
                src="/settings.svg"
                alt="Settings Icon"
                width={40}
                height={40}
              />
              <h2>SETTINGS</h2>
        </div>
          <ul>
            <li onClick={handleSecurityClick}>
              <span className="title">Profile</span>
              <Image
                src="/gg_profile.svg"
                alt="Profile Icon"
                width={40}
                height={40}
              />
            </li>
            <li className="activated">
            <span className="title">Security</span>
              <Image
                src="/lock-icon.svg"
                alt="Lock Icon"
                width={40}
                height={40}
              />
            </li>
          </ul>
        </div>

        <div className="main-space-settings">
        <form onSubmit={handleChangeEmail} className="security-form">
            <h2>Change Email</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className="email-container">
              <label>{user.email}</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                placeholder="Enter new email"
              />
            </div>
            <button type="submit">Change Email</button>
          </form>
        <form onSubmit={handleChangePassword} className="security-form">
          <h2>Change Password</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <div className="password-container">
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="password-container">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="password-container">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
        </form>
        </div>
      </div>
    </div>
  );
}
