"use client";

import { useState, useEffect } from "react";

export default function PomodoroTimer() {
    const [time, setTime] = useState(25 * 60); // 25 minutes in seconds (default Pomodoro)
    const [isRunning, setIsRunning] = useState(false);
    const [timerMode, setTimerMode] = useState("pomodoro"); // New state to track the selected timer mode

    useEffect(() => {
        let timer;
        
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false); // Stop the timer when time reaches 0
        }

        // Cleanup interval on component unmount or when isRunning changes
        return () => clearInterval(timer);

    }, [isRunning, time]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const toggleTimer = () => {
        setIsRunning((prev) => !prev);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimerMode("pomodoro"); // Reset timer mode to Pomodoro
        setTime(25 * 60); // Reset to 25 minutes
    };

    // Function to set the timer duration based on the selected mode
    const changeTimerMode = (mode) => {
        setIsRunning(false); // Stop the timer before changing mode
        setTimerMode(mode);
        if (mode === "pomodoro") {
            setTime(25 * 60); // 25 minutes for Pomodoro
        } else if (mode === "shortBreak") {
            setTime(5 * 60); // 5 minutes for Short Break
        } else if (mode === "longBreak") {
            setTime(15 * 60); // 15 minutes for Long Break
        } else if (mode === "ownTimer") {
            // If it's a custom timer, ask the user for their preferred time (in seconds)
            const customTime = prompt("Enter custom time in minutes:", "25");
            setTime(Number(customTime) * 60); // Convert minutes to seconds
        }
    };
    
    return (
        <div>
            <h1>Pomodoro Timer</h1>
            <h3>{formatTime(time)}</h3>
            
            <div>
                <button onClick={() => changeTimerMode("pomodoro")}>Pomodoro</button>
                <button onClick={() => changeTimerMode("shortBreak")}>Short Break</button>
                <button onClick={() => changeTimerMode("longBreak")}>Long Break</button>
                <button onClick={() => changeTimerMode("ownTimer")}>Own Timer</button>
            </div>
            
            <div>
                <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
                <button onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
}
