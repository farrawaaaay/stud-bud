'use client';

import { useState, useEffect } from "react";

import Notes from "../notes/page";
import Music from "../spotify/page";
import Tasks from "../task/page";
import PomodoroTimer from "../timer/page";
import StudbudCalendar from "../studbud-calendar/page";
import Image from "next/image"; 

import "../../styles/workspace.css";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSideOpen, setSideOpen] = useState(false);
  const [quote, setQuote] = useState(null);
  const [user, setUser] = useState({ name: '', profilePic: '' });
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimerVisible, setTimerVisible] = useState(false);
  const [isNotesVisible, setNotesVisible] = useState(false);
  const [isTaskVisible, setTaskVisible] = useState(false);

  const router = useRouter();

  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  

  const toggleSide = () => {
    setSideOpen(!isSideOpen);
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const toggleTimer = () => {
    setTimerVisible(!isTimerVisible);
  };

  const toggleNotes = () => {
    setNotesVisible(!isNotesVisible);
  };

  const toggleTask = () => {
    setTaskVisible(!isTaskVisible);
  }

  const logout = () => {
    // Remove user and token data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Use history.replaceState to prevent going back to the previous page
    window.history.replaceState(null, '', window.location.href);
    
    // Redirect to login page
    router.push('/login');
  };
  
  

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quotes');
        const data = await response.text();
        if (data) {
          try {
            const jsonData = JSON.parse(data);
            setQuote(jsonData);
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
          }
        } else {
          console.error('Empty response from /api/quotes');
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    const validateToken = async (token) => {
      try {
        const response = await fetch('/api/valid-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });


        if (response.ok) {
          return true;
        } else {
          console.error('Invalid token response:', response.status, await response.text());
          return false;
        }
      } catch (error) {
        console.error('Token validation error:', error);
        return false;
      }
    };

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      router.push('/login');
    }

    if (storedToken && storedUser) {
      validateToken(storedToken).then((isValid) => {
        if (isValid) {
          try {
            const user = JSON.parse(storedUser);
            setUser(user);
            fetchQuote();
          } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
  });
} else {
  console.error('Token or user data missing. Redirecting to login.');
  router.push('/login');
}

  }, [router]);

  return (
    <div className="workspace-container">
      <div className="up-logo">
        <Image src="/studbud-logo.svg" alt="logo" width={80} height={80} />
        <div className="quotes">
          {quote ? (
            <>
              <p>"{quote.q}"</p>
              <p>- {quote.a}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className={`profile-container ${isProfileOpen ? "open" : ""}`}>
          <div className={`profile-details ${isProfileOpen ? "open" : ""}`}>
            <div className="profile-icon">
              <div className="profile">
                <Image
                  src={user.profilePicture || 'https://res.cloudinary.com/dvorbtw7b/image/upload/v1735892282/StudBud/default_profile.svg'}
                  width={50}
                  height={50}
                  alt="Profile Icon"
                />
              </div>
              <span className="username">{user.name}</span>
            </div>
            {isProfileOpen && (
              <div className="options">
                <ul>
                  {[{ icon: "/settings.svg", label: "Settings", onClick: navigateToSettings },
                    { icon: "/help.svg", label: "Help" },
                    { icon: "/logout.svg", label: "Logout", onClick: logout }].map((item, index) => (
                      <li key={index} onClick={item.onClick}>
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
        <div className={`pick-bar ${isSideOpen ? "open" : ""}`}>
          <button className="toggleBtn" onClick={toggleSide}>
            {isSideOpen ? "◀" : "▶"}
          </button>
          <ul>
            <li onClick={toggleCalendar}>
              <Image
                src="/Calendar.svg"
                alt="Calendar Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Calendar</span>}
            </li >
            <li onClick={toggleTask}>
              <Image
                src="/Task.svg"
                alt="Task Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Task</span>}
            </li>
            <li onClick={toggleTimer}>
              <Image
                src="/Timer.svg"
                alt="Timer Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Timer</span>}
            </li>
            <li onClick={toggleNotes}>
              <Image
                src="/Notes.svg"
                alt="Notes Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Notes</span>}
            </li>
            <li>
              <Image
                src="/File-Organizer.svg"
                alt="File Organizer Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Files</span>}
            </li>
            
          </ul>
        </div>

        <div className="main-space">

        {isCalendarVisible && (
          <div className="calendars-container">
            <StudbudCalendar />
          </div>
        )}

        {isTaskVisible && (
        <div className="tasks-container">
          <Tasks/>
        </div>
        )}

        {isTimerVisible && (
          <div className="timers-container">
            <PomodoroTimer />
          </div>
        )}

        {isNotesVisible && (
          <div className="notes-container">
            <Notes />
          </div>
        )}

        

        <div className="music-container">
          <Music/>
        </div>

        <div className="files-container">
        
      </div>  

      </div>

      </div>
    </div>
  );
}
