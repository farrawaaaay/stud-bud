'use client'

import { useState, useEffect } from "react";
import "../../styles/task.css";
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css'; // Import styles for the calendar
import "../../styles/calendar.css";

const tileClassName = ({ date }) => {
    if (date.getDay() === 0) {
      return 'sunday';
    }
    return null;
  };

const StudbudCalendar = () => {
  

  return (
    <div className="calendar-container">
        <h1>Calendar</h1>
      <Calendar tileClassName={tileClassName} />
    </div>
  );
};

export default StudbudCalendar;
