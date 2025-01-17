'use client'

import { useState, useEffect } from "react";
import "../../styles/task.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // State for storing tasks
  const [filter, setFilter] = useState("all");
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    category: "",
    deadline: "",
  });
  const [expandedTaskId, setExpandedTaskId] = useState(null); // Track which task is expanded
  const [tags, setTags] = useState([]); // State for storing task tags

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/task", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);

          // Extract unique categories from tasks for filtering
          const uniqueTags = [...new Set(data.map((task) => task.category))];
          setTags(uniqueTags);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks((prev) => [...prev, createdTask]);
        setIsFormVisible(false);
        setNewTask({ title: "", content: "", category: "", deadline: "" });
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId ? { ...task, status: updatedTask.status } : task
          )
        );
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleCheckboxChange = async (taskId, status, type) => {
    const newStatus = type === "completed" 
      ? status === "completed" ? "to-do" : "completed"
      : status === "in-progress" ? "to-do" : "in-progress"; // Toggle between statuses
    await handleStatusChange(taskId, newStatus);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <div className="task-container">
      <h1>Tasks</h1>

      <div className="process-view">
        <button 
            onClick={() => setFilter("all")} 
            className={filter === "all" ? "active" : ""}
        >
            My Tasks
        </button>
        <button 
            onClick={() => setFilter("in-progress")} 
            className={filter === "in-progress" ? "active" : ""}
        >
            In Progress
        </button>
        <button 
            onClick={() => setFilter("completed")} 
            className={filter === "completed" ? "active" : ""}
        >
            Completed
        </button>
        </div>

      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-item">
              <h3 onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}>
                {task.title}
              </h3>
              <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "No deadline"}</p>


                {/* Checkbox to mark the task as in-progress */}
                <label>
                <input
                  type="checkbox"
                  checked={task.status === "in-progress"}
                  onChange={() => handleCheckboxChange(task._id, task.status, "in-progress")}
                />
                In Progress
              </label>

              {/* Checkbox to mark the task as completed */}
              <label>
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleCheckboxChange(task._id, task.status, "completed")}
                />
                Completed
              </label>

              

              {expandedTaskId === task._id && (
                <div className="task-details">
                  <p>{task.content}</p>
                  <p>Tag: {task.category}</p>
                  <p>Status: {task.status}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>

      <button className="add-task" onClick={() => setIsFormVisible(true)}>
        + Add Task
      </button>

      {/* Task Form Modal */}
      {isFormVisible && (
        <div className="modal-overlay" onClick={() => setIsFormVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="task-form">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                placeholder="Content"
                value={newTask.content}
                onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              />
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
              <button type="button" onClick={handleAddTask}>Add Task</button>
              <button type="button" onClick={() => setIsFormVisible(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
