"use client";

import { useState, useEffect } from "react";
import "../../styles/timer.css";

function PomodoroTimer() {
    const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [timerMode, setTimerMode] = useState("pomodoro");
    const [task, setTask] = useState("");
    const [isTaskEntered, setIsTaskEntered] = useState(false);
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [showCustomTimePopup, setShowCustomTimePopup] = useState(false); // Popup visibility


    useEffect(() => {
        let timer;

        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
        }

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
        setTimerMode("pomodoro");
        setTime(25 * 60);
        setTask("");
        setIsTaskEntered(false);
        setIsEditingTask(false);
        setShowCustomTimePopup(false); // Hide popup on reset
    };

    const changeTimerMode = (mode) => {
        if (mode === timerMode) return;

        setIsRunning(false);
        setTimerMode(mode);
        setShowCustomTimePopup(mode === "ownTimer");

        if (mode === "pomodoro") {
            setTime(25 * 60);
        } else if (mode === "shortBreak") {
            setTime(5 * 60);
        } else if (mode === "longBreak") {
            setTime(15 * 60);
        }
    };

    const handleCustomTimeSubmit = (e) => {
        e.preventDefault();
        const customMinutes = e.target.elements.customMinutes.value;
        if (customMinutes && !isNaN(customMinutes) && customMinutes > 0) {
            setTime(customMinutes * 60);
            setShowCustomTimePopup(false);
        }
    };

    const handleTaskChange = (event) => {
        setTask(event.target.value);
    };

    const handleTaskSubmit = (e) => {
        e.preventDefault();
        setIsTaskEntered(true);
    };

    const handleTaskSubmitChange = (e) => {
        e.preventDefault();
        setIsEditingTask(false);
    };



    return (
        <div className="timer-container">
            <div className="timer-selection">
                <button
                    onClick={() => changeTimerMode("pomodoro")}
                    disabled={timerMode === "pomodoro"}
                    className={timerMode === "pomodoro" ? "active" : ""}
                >
                    Pomodoro
                </button>
                <button
                    onClick={() => changeTimerMode("shortBreak")}
                    disabled={timerMode === "shortBreak"}
                    className={timerMode === "shortBreak" ? "active" : ""}
                >
                    Short Break
                </button>
                <button
                    onClick={() => changeTimerMode("longBreak")}
                    disabled={timerMode === "longBreak"}
                    className={timerMode === "longBreak" ? "active" : ""}
                >
                    Long Break
                </button>
                <button
                    onClick={() => changeTimerMode("ownTimer")}
                    disabled={timerMode === "ownTimer"}
                    className={timerMode === "ownTimer" ? "active" : ""}
                >
                    Own Timer
                </button>
            </div>

            <h5>
                {time === 0
                    ? timerMode === "pomodoro"
                        ? "Great job! You've completed your Pomodoro!"
                        : timerMode === "shortBreak"
                        ? "Nice work! Short break is over!"
                        : timerMode === "longBreak"
                        ? "Well done! Long break is over!"
                        : timerMode === "ownTimer"
                        ? "Awesome! Your custom timer is up!"
                        : ""
                    : isRunning
                    ? timerMode === "pomodoro"
                        ? "Time to focus on your task!"
                        : timerMode === "shortBreak"
                        ? "Time for a short break!"
                        : timerMode === "longBreak"
                        ? "Time to relax during your long break!"
                        : timerMode === "ownTimer"
                        ? `Focus! Your custom timer is running!`
                        : "Time to focus!"
                    : "Start focusing now!"}
            </h5>
            <h3>{formatTime(time)}</h3>

            <div className="task-input">
                {!isTaskEntered ? (
                    <form onSubmit={handleTaskSubmit}>
                        <input
                            type="text"
                            placeholder="Enter your task here..."
                            value={task}
                            onChange={handleTaskChange}
                        />
                    </form>
                ) : (
                    <div onClick={() => setIsEditingTask(true)}>
                        {isEditingTask ? (
                            <div>
                                <input
                                    type="text"
                                    value={task}
                                    onChange={handleTaskChange}
                                    onBlur={handleTaskSubmitChange}
                                />
                            </div>
                        ) : (
                            <p>
                                <strong>Task: {task}</strong>
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="timer-toggle">
                <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
                <button onClick={resetTimer}>Reset</button>
                {timerMode === "ownTimer" && (
                    <button onClick={() => setShowCustomTimePopup(true)}>Edit</button>
                )}
            </div>

            {showCustomTimePopup && (
                <div className="custom-time-popup">
                    <form onSubmit={handleCustomTimeSubmit}>
                        <label htmlFor="customMinutes">Edit Time (minutes): </label>
                        <input
                            type="number"
                            id="customMinutes"
                            name="customMinutes"
                            min="1"
                            required
                        />
                        <button type="submit">Set</button>
                    </form>
                </div>
            )}
        </div>

    );
}


export default PomodoroTimer;