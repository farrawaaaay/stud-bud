'use client'

import { useState, useEffect } from "react";
import PomodoroTimer from "../timer/page";
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
  const router = useRouter();

 
  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  const tileClassName = ({ date }) => {
    // If it's Sunday (getDay() === 0)
    if (date.getDay() === 0) {
      return 'sunday'; // Add a custom 'sunday' class
    }
    return null;
  };

  const toggleSide = () => {
    setSideOpen(!isSideOpen);
  };

  const navigateToSettings = () => {
    router.push('/settings'); // Navigate to the settings page
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible); // Toggle calendar visibility
  };

  const toggleTimer =() =>{
    setTimerVisible(!isTimerVisible);
  }

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quotes');
        const data = await response.text(); // Read the response as text
        if (data) {
          try {
            const jsonData = JSON.parse(data); // Parse it as JSON
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
  
    fetchQuote();

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser); // Attempt to parse the stored user data
        setUser(user); // Set the user data if parsing is successful
      } catch (error) {
        console.error('Error parsing user data:', error); // Handle JSON parse errors
        router.push('/login'); // Redirect to login if the data is invalid
      }
    } else {
      router.push('/login'); // Redirect to login if no user data is found
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
                    { icon: "/logout.svg", label: "Logout" }].map((item, index) => (
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
            <li>
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
            <li><a href="/notes">
              <Image
                src="/Notes.svg"
                alt="Notes Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Notes</span>}
              </a>
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
            <li>
              <Image
                src="/Music.svg"
                alt="Music Icon"
                width={40}
                height={40}
              />
              {isSideOpen && <span className="title">Music</span>}
            </li>
          </ul>
        </div>

        {isCalendarVisible && (
          <div className="calendar-container">
            <Calendar tileClassName={tileClassName} />
          </div>
        )}

        {isTimerVisible && (
          <div className="timer-container">
          <PomodoroTimer />
        </div>
        )}
      </div>
    </div>
  );
}
