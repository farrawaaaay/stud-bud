'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import "../../styles/workspace.css";
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSideOpen, setSideOpen] = useState(false);
  const [user, setUser] = useState({ name: '', profilePic: '' });
  const [newUsername, setNewUsername] = useState('');
  const [isUsernameAvailable, setUsernameAvailable] = useState(true);
  const [isChangingUsername, setChangingUsername] = useState(false);
  const [isUsernameFormVisible, setIsUsernameFormVisible] = useState(false); // New state to toggle the form
  const router = useRouter();

  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  const toggleSide = () => {
    setSideOpen(!isSideOpen);
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

  const handleUpload = async () => {
    if (window.cloudinary) {
      const cloudName = "dvorbtw7b";
      const uploadPreset = "studbud-upload";
  
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          folder: "StudBud/profile-pictures",
        },
        async (error, result) => {
          if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
  
            const updatedUser = { ...user, profilePicture: imageUrl };
            setUser(updatedUser);
  
            await fetch('/api/update-profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email, profilePicture: imageUrl }), // Use email instead of userId
            });
  
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      );
  
      widget.open();
    } else {
      console.error("Cloudinary widget is not loaded");
    }
  };
  

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const checkUsernameAvailability = async (username) => {
    const response = await fetch('/api/check-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const result = await response.json();
    setUsernameAvailable(result.isAvailable);
  };

  const submitUsernameChange = async () => {
    if (isUsernameAvailable) {
      setChangingUsername(true);

      // Call API to update the username
      const res = await fetch('/api/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, username: newUsername }),
      });

      const data = await res.json();
      setChangingUsername(false);

      if (data.message) {
        // Update user data locally
        const updatedUser = { ...user, name: newUsername };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setIsUsernameFormVisible(false); // Hide form after successful update
      } else {
        // Handle error (e.g., username taken or server error)
        console.error(data.error || 'Error updating username');
      }
    }
  };

  const handleChangeUsernameClick = () => {
    setIsUsernameFormVisible(!isUsernameFormVisible); // Toggle the form visibility
  };

  const handleSecurityClick = () => {
    router.push('/settings-security');
  };

  useEffect(() => {
    if (newUsername.length > 0) {
      checkUsernameAvailability(newUsername);
    }
  }, [newUsername]);


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
                    { icon: "/help.svg", label: "Help" },
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
            <li className="activated">
              <span className="title">Profile</span>
              <Image
                src="/gg_profile.svg"
                alt="Profile Icon"
                width={40}
                height={40}
              />
            </li>
            <li onClick={handleSecurityClick}>
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
      <div className="main-space">
      <span className="setting-username">{user.name}</span>
        <div className="profile">
          <Image
            src={user.profilePicture || 'https://res.cloudinary.com/dvorbtw7b/image/upload/v1735892282/StudBud/default_profile.svg'}
            width={100}
            height={100}
            alt="Profile Icon"
          />
        </div>
        <button className="change-icon" onClick={handleUpload}>
          Change Icon
        </button>

        <button className="change-username" onClick={handleChangeUsernameClick}>
            {isUsernameFormVisible ? 'Cancel' : 'Change Username'}
          </button>

          {isUsernameFormVisible && (
            <div className="username-form">
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                placeholder="Enter new username"
              />
              <button 
                onClick={submitUsernameChange} 
                disabled={!isUsernameAvailable || isChangingUsername}
              >
                {isChangingUsername ? 'Changing...' : 'Submit'}
              </button>
              {!isUsernameAvailable && <p className="error-text">Username is already taken.</p>}
            </div>
          )}
      </div>
      </div>
    </div>
  );
}
