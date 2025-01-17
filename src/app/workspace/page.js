'use client';

import { useState, useEffect } from "react";
import PomodoroTimer from "../timer/page";
import Notes from "../notes/page";
import Music from "../spotify/page"
import Image from "next/image"; 
import "../../styles/workspace.css";
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import styles for the calendar
import "../../styles/calendar.css";

export default function Home() {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSideOpen, setSideOpen] = useState(false);
  const [quote, setQuote] = useState(null);
  const [user, setUser] = useState({ name: '', profilePic: '' });
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isTimerVisible, setTimerVisible] = useState(false);
  const [isNotesVisible, setNotesVisible] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 10, left: 100 });
  const [timerPosition, setTimerPosition] = useState({ top: 10, left: 600 });
  const [notesPosition, setNotesPosition] = useState({top:10, left: 600});
  


  const handleDragStart = (e, type) => {
    // Store the initial offset from where the drag started
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('offsetX', e.clientX - (type === 'calendar' ? calendarPosition.left : type === 'notes' ? notesPosition.left : timerPosition.left));
    e.dataTransfer.setData('offsetY', e.clientY - (type === 'calendar' ? calendarPosition.top : type === 'notes' ? notesPosition.top : timerPosition.top));
  };
  
  const handleDrop = (e, type) => {
    const offsetX = parseInt(e.dataTransfer.getData('offsetX'));
    const offsetY = parseInt(e.dataTransfer.getData('offsetY'));
  
    // Calculate the new position without any restrictions (No minLeft, minTop)
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
  
    // Ensure that the new position is calculated correctly without being restricted
    if (type === 'calendar') {
      setCalendarPosition({ top: newTop, left: newLeft });
    } else if (type === 'notes') {
      setNotesPosition({ top: newTop, left: newLeft });
    } else {
      setTimerPosition({ top: newTop, left: newLeft });
    }
  };
  

const handleDragOver = (e) => {
  e.preventDefault(); // Allow dropping
};


  const router = useRouter();

  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  const tileClassName = ({ date }) => {
    if (date.getDay() === 0) {
      return 'sunday';
    }
    return null;
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
            <li onClick={() => router.push("/task")}>
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

        {isCalendarVisible && (
          <div
            className="calendar-container"
            style={{ top: calendarPosition.top, left: calendarPosition.left }}
            draggable
            onDragStart={(e) => handleDragStart(e, 'calendar')}
            onDrop={(e) => handleDrop(e, 'calendar')}
            onDragOver={handleDragOver}
          >
            <Calendar tileClassName={tileClassName} />
          </div>
        )}

        {isTimerVisible && (
          <div
            className="timer-container"
            style={{ top: timerPosition.top, left: timerPosition.left }}
            draggable
            onDragStart={(e) => handleDragStart(e, 'timer')}
            onDrop={(e) => handleDrop(e, 'timer')}
            onDragOver={handleDragOver}
          >
            <PomodoroTimer />
          </div>
        )}

        {isNotesVisible && (
          <div
            className="notes-container"
            style={{ top: notesPosition.top, left: notesPosition.left }}
            draggable
            onDragStart={(e) => handleDragStart(e, 'notes')}  // Pass 'notes' as the type
            onDrop={(e) => handleDrop(e, 'notes')}            // Handle drop specifically for notes
            onDragOver={handleDragOver}
          >
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
  );
}
