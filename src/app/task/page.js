'use client'

import { useState, useEffect } from "react";
import { TfiTrash, TfiPencilAlt } from "react-icons/tfi";
import "../../styles/task.css";

// Reusable PopupModal Component
const PopupModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button className="popup-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

// Reusable TaskForm Component
const TaskForm = ({ taskToEdit, onSave, onCancel }) => {
  const today = new Date().toISOString().split("T")[0];
  const [newTask, setNewTask] = useState(taskToEdit || {
    title: "",
    content: "",
    category: "",
    deadline: "",
  });

  const handleKeyDown = (e) => {
    const { value } = e.target;
    if (e.key === ' ' && value.length === 0) e.preventDefault();
  };

  return (
    <form className="task-form">
      <p className="task-form-title">Task title: *</p>
      <div className="input-group">
        <input
          type="text"
          placeholder="Task"
          value={newTask.title}
          maxLength={50}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <span className="char-count">{newTask.title.length}/50</span>
      </div>

      <p className="task-form-title">Description: *</p>
      <div className="input-group">
        <textarea
          placeholder="Description"
          value={newTask.content}
          maxLength={250}
          onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <span className="char-count">{newTask.content.length}/250</span>
      </div>

      <p className="task-form-title">Tag: *</p>
      <input
        type="text"
        placeholder="Tag"
        value={newTask.category}
        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        onKeyDown={handleKeyDown}
      />

      <p className="task-form-title">Set Deadline: *</p>
      <input
        type="date"
        value={newTask.deadline}
        min={today}
        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
      />

      <div className="task-buttons">
        <button type="button" onClick={() => onSave(newTask)} className="create-task">
          {taskToEdit ? "Update Task" : "Add Task"}
        </button>
        <button type="button" onClick={onCancel} className="cancel-task">Cancel</button>
      </div>
    </form>
  );
};

// Reusable TaskItem Component
const TaskItem = ({ task, onEdit, onDelete, onStatusChange, expandedTaskId, setExpandedTaskId }) => {
  return (
    <div className="task-item" onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}>
      <div className="task-title-header">
        <h3>{task.title}</h3>
        <div>
          <button onClick={() => onEdit(task)}><TfiPencilAlt /></button>
          <button onClick={() => onDelete(task._id)}><TfiTrash /></button>
        </div>
      </div>
      <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "No deadline"}</p>

      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            checked={task.status === "in-progress"}
            onChange={() => onStatusChange(task._id, "in-progress")}
          />
          In Progress
        </label>
        <label>
          <input
            type="checkbox"
            checked={task.status === "completed"}
            onChange={() => onStatusChange(task._id, "completed")}
          />
          Completed
        </label>
      </div>

      {expandedTaskId === task._id && (
        <div className="task-details">
          <p>Details: {task.content}</p>
          <p className="tag">Tag: {task.category}</p>
        </div>
      )}
    </div>
  );
};

// Main Tasks Component
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/task", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const sortedTasks = data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
          setTasks(sortedTasks);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async (newTask) => {
    if (!newTask.title || !newTask.deadline) {
      setModalMessage("Please fill out all required fields.");
      return;
    }

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
        setModalMessage("Task created!");
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await fetch(`/api/task/${updatedTask._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const updatedTaskData = await response.json();
        setTasks((prev) => prev.map((task) => task._id === updatedTaskData._id ? updatedTaskData : task));
        setIsFormVisible(false);
        setTaskToEdit(null);
        setModalMessage("Task edited!");
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        setIsModalVisible(false);
        setModalMessage("Task deleted!");
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
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
        setTasks((prev) => prev.map((task) => task._id === taskId ? { ...task, status: updatedTask.status } : task));
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="task-container">
      <div className="task-header">
        <h1>Tasks</h1>
        <button className="add-task" onClick={() => setIsFormVisible(true)}>+ Add</button>
      </div>

      <div className="process-view">
        <button onClick={() => setFilter("to-do")} className={filter === "to-do" ? "active" : ""}>My Tasks</button>
        <button onClick={() => setFilter("in-progress")} className={filter === "in-progress" ? "active" : ""}>In Progress</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
      </div>

      <div className="task-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.replace(/^\s+/g, ""))}
        />
      </div>

      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={(task) => {
                setTaskToEdit(task);
                setIsFormVisible(true);
              }}
              onDelete={(taskId) => {
                setTaskToDelete(taskId);
                setIsModalVisible(true);
              }}
              onStatusChange={handleStatusChange}
              expandedTaskId={expandedTaskId}
              setExpandedTaskId={setExpandedTaskId}
            />
          ))
        ) : (
          <div className="none-tasks">
            <p>No tasks available.</p>
          </div>
        )}
      </div>

      {isFormVisible && (
        <div className="modal-overlay" onClick={() => setIsFormVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              taskToEdit={taskToEdit}
              onSave={taskToEdit ? handleEditTask : handleAddTask}
              onCancel={() => {
                setIsFormVisible(false);
                setTaskToEdit(null);
              }}
            />
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete-modal-content">
            <p>Are you sure you want to delete this task?</p>
            <button className="cancel-task" onClick={() => handleDeleteTask(taskToDelete)}>Confirm</button>
            <button className="create-task" onClick={() => setIsModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}

      <PopupModal message={modalMessage} onClose={() => setModalMessage("")} />
    </div>
  );
};

export default Tasks;