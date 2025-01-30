'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TfiMoreAlt } from "react-icons/tfi";
import { TfiClipboard } from "react-icons/tfi";
import { TfiArrowLeft } from "react-icons/tfi";
import { TfiTrash, TfiPencilAlt, TfiDownload } from "react-icons/tfi";
import { useRouter } from 'next/navigation';
import { jsPDF } from "jspdf";
import "../../styles/collaboration.css";
import DeleteConfirmationModal from '../deleteConfirmationModal/page';


export default function CollabPage() {
  const [user, setUser] = useState({ name: '', profilePic: '' });
  const [quote, setQuote] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [isWorkspaceSettingsOpen, setWorkspaceSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState("");
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [workspaceIdToJoin, setWorkspaceIdToJoin] = useState(""); // To handle pasting workspace ID to join
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
  const [isJoinWorkspaceModalOpen, setIsJoinWorkspaceModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeWorkspace?.title || "");
  const [openWorkspaceID, setOpenWorkspaceID] = useState(null);

  const [activeTool, setActiveTool] = useState("NOTE"); // Default to "NOTE"
  const [notes, setNotes] = useState([]);
  const [newCollabNoteContent, setNewNoteContent] = useState("");
  const [newCollabNoteTitle, setNewCollabNoteTitle] = useState(""); 
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", status: "todo" });
  
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const settingsRef = useRef(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  


  const [members, setMembers] = useState([]);
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(selectedNote?.content);
  const [editedNotetitle, setEditedNoteTitle] = useState(selectedNote?.title);

  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('TODO');
  const [copiedWorkspace, setCopiedWorkspace] = useState(null);


  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
const [taskToDelete, setTaskToDelete] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(selectedNote?.content);
    setEditedNoteTitle(selectedNote?.title);   // Reset content
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleTaskDeleteClick = (taskId) => {
    setTaskToDelete(taskId); // Store the task ID that needs to be deleted
    setShowDeleteTaskModal(true); // Show the confirmation modal
  };

  const handleTaskClick = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setSelectedTask(task);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setWorkspaceSettingsOpen(false);
      }
    };

    if (isWorkspaceSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWorkspaceSettingsOpen]);

  useEffect(() => {
    setSelectedNote(null); // Reset selected note when workspace changes
    setSelectedTask(null);
  }, [activeWorkspace]); 

  const handleToolClick = (tool) => {
    setActiveTool(tool);
  };

  
  
  const navigateToOriginal = () => {
    router.push('/workspace');
  };

  const toggleWorkspaceSettings = () => {
    setWorkspaceSettingsOpen(!isWorkspaceSettingsOpen);
  };

  const toggleWorkspaceOption = (workspaceId) => {
    setOpenWorkspaceID((prevId) => (prevId === workspaceId ? null : workspaceId));
};
  

  const openCreateWorkspaceModal = () => {
    setIsCreateWorkspaceModalOpen(true);
  };
  
  const closeCreateWorkspaceModal = () => {
    setIsCreateWorkspaceModalOpen(false);
  };

  const openJoinWorkspaceModal = () => {
    setIsJoinWorkspaceModalOpen(true);
  };
  
  const closeJoinWorkspaceModal = () => {
    setIsJoinWorkspaceModalOpen(false);
  };

  const toggleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  };
  
  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleNoteTitleChange = (e) => {
    const title = e.target.value;
    if (title.length <= 50) {
      setNewCollabNoteTitle(title);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && e.target.value.length === 0) {
      e.preventDefault();
    }
  };

  const handleDownloadNoteAsPDF = (title, content) => {
    // Create a new PDF instance
    const doc = new jsPDF();
  
    // Set the font size and add the title
    doc.setFontSize(18);
    doc.text(title, 10, 10);
  
    // Set the font size for the content
    doc.setFontSize(12);
  
    // Split the content into lines that fit within the PDF page width
    const lines = doc.splitTextToSize(content, 180); // 180 is the max width in mm
  
    // Add the content to the PDF
    doc.text(lines, 10, 20);
  
    // Save the PDF with the note's title as the file name
    doc.save(`${title}.pdf`);
  };
  
  const saveEditedTitle = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("You must be logged in to edit the workspace title.");
      return;
    }
  
    try {
      const response = await fetch("/api/workspaces-update-title", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspaceId: activeWorkspace._id,
          title: editedTitle,
        }),
      });
  
      if (response.ok) {
        const updatedWorkspace = await response.json();
        setActiveWorkspace(updatedWorkspace);
        setIsEditingTitle(false);  // Close the editing mode
        alert("Workspace title updated successfully.");
        window.location.reload();  // Use window.location.reload() to refresh the page
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error updating workspace title:", error);
      alert("An error occurred while updating the workspace title.");
    }
  };

  useEffect(() => {
    if (!activeWorkspace) return;

    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/workspaces/${activeWorkspace._id}/members`);
        const data = await response.json();
        setMembers(data);  // Set the members of the active workspace
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [activeWorkspace]);
  
  
  const fetchUserData = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.student);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchWorkspaces = async () => {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      alert("You must be logged in to view workspaces");
      return;
    }
  
    try {
      const response = await fetch('/api/workspaces', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Exclude workspaces where isDefault is true
        const filteredWorkspaces = data.filter(workspace => !workspace.isDefault);
        setWorkspaces(filteredWorkspaces); // Set only the filtered workspaces
        if (filteredWorkspaces.length > 0) {
          setActiveWorkspace(filteredWorkspaces[0]); // Set the first workspace as active
        }
      } else {
        alert("Error fetching workspaces");
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };
  
  
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to create a workspace");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/workspaces-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newWorkspaceTitle,
          description: newWorkspaceDescription
        }),
      });

      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
        setNewWorkspaceTitle("");
        setNewWorkspaceDescription("");
        alert("Workspace created successfully");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("An error occurred while creating the workspace.");
    }

    setIsLoading(false);
  };

  const handleJoinWorkspace = async (workspaceId) => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to join a workspace");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/workspaces-join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workspaceId }),
      });

      if (response.ok) {
        const updatedWorkspace = await response.json();
            alert("You have successfully joined the workspace!");

            // Ensure the workspace is added to the list if not already present
            setWorkspaces((prevWorkspaces) => {
                const isExisting = prevWorkspaces.some(ws => ws._id === updatedWorkspace._id);
                return isExisting ? prevWorkspaces.map(ws => 
                    ws._id === updatedWorkspace._id ? updatedWorkspace : ws
                ) : [...prevWorkspaces, updatedWorkspace];
            });
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error joining workspace:", error);
      alert("An error occurred while joining the workspace.");
    }

    setIsLoading(false);
  };

  const handleWorkspaceClick = (workspace) => {
    setActiveWorkspace(workspace);
  };

  const handleJoinById = (e) => {
    e.preventDefault();

    if (!workspaceIdToJoin) {
      alert("Please enter a workspace ID.");
      return;
    }

    handleJoinWorkspace(workspaceIdToJoin);
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

    fetchQuote();
    fetchUserData(); 
    fetchWorkspaces(); 
  }, []);

  useEffect(() => {
    if (activeWorkspace) {
      fetchNotes();
      fetchTasks();
    }
  }, [activeWorkspace]);
  

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token || !activeWorkspace) return;
  
    try {
      const response = await fetch(`/api/collabNotes?workspaceId=${activeWorkspace._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    if (!token || !activeWorkspace || !newCollabNoteContent.trim() || !newCollabNoteTitle.trim()) return;
  
    try {
      const response = await fetch("/api/collabNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          collabNoteContent: newCollabNoteContent,
          workspaceId: activeWorkspace._id,
          collabNoteTitle: newCollabNoteTitle, // Send title
        }),
      });
  
      if (response.ok) {
        const newCollabNote = await response.json();
        setNotes((prevNotes) => [newCollabNote, ...prevNotes]);
        setNewNoteContent(""); // Clear the content
        setNewCollabNoteTitle(""); // Clear the title
      } else {
        console.error("Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
};

const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editedContent) return;

    try {
      const response = await fetch(`/api/collabNotes/${selectedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newContent: editedContent,
          newTitle: editedNotetitle,  // Optionally you can allow editing the title too
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();

        // Update selectedNote immediately
        setSelectedNote(updatedNote);
        // Update the note in the local state
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === updatedNote._id ? updatedNote : note
          )
        );
        setIsEditing(false);
      } else {
        console.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`/api/collabNotes/${selectedNote._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          collabNoteId: selectedNote._id,
        }),
      });

      if (response.ok) {
        // Remove the deleted note from the local state
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== selectedNote._id));
        setSelectedNote(null); // Clear selectedNote to show "Click a note"
        setShowDeleteModal(false); // Close the modal
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close the modal without doing anything
  };
  
  

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token || !activeWorkspace) return console.error("No token or workspace found");
  
    try {
      const response = await fetch(`/api/collabTasks?workspaceId=${activeWorkspace._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks:", response.status);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!activeWorkspace) return;
  
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");
  
    try {
      const response = await fetch(`/api/collabTasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskTitle: newTask.title,
          taskDescription: newTask.description,
          workspaceId: activeWorkspace._id,
          assigneeId: newTask.assignedTo,
          deadline: newTask.deadline, // Add this line
        }),
      });
  
      if (response.ok) {
        const createdTask = await response.json();
        setTasks([...tasks, createdTask]);
        setNewTask({ title: "", description: "", assignedTo: "", status: "TODO", deadline: "" });
      } else {
        const error = await response.json();
        console.error("Error adding task:", error);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleConfirmDeleteTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");
  
    try {
      const response = await fetch(`/api/collabTasks/${taskToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Immediately reflect the task deletion in the task list
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete));
  
        // If the deleted task is the selected one, clear the selected task
        if (selectedTask && selectedTask._id === taskToDelete) {
          setSelectedTask(null);
        }
  
        setShowDeleteTaskModal(false); // Close the modal after successful deletion
      } else {
        const error = await response.json();
        console.error("Error deleting task:", error);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  
  const handleCancelDeleteTask = () => {
    setShowDeleteTaskModal(false); // Simply close the modal
  };
  
  
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Ensure status is in uppercase before sending it
      const status = newStatus.toUpperCase();
  
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      
      if (!token) {
        console.error("No token found, unauthorized request");
        return;
      }
  
      console.log("Sending request with:", { taskId, status });
  
      const response = await fetch(`/api/collabTasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),  // Send status in uppercase
      });
  
      if (response.ok) {
        const updatedTask = await response.json();
        
      
            // ✅ Update `tasks` state immediately
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === taskId ? { ...task, status: updatedTask.status } : task
              )
            );
      
            // ✅ Update `selectedTask` immediately if it's the one being modified
            setSelectedTask((prevSelected) =>
              prevSelected && prevSelected._id === taskId
                ? { ...prevSelected, status: updatedTask.status }
                : prevSelected
            );
        console.log("Task updated successfully:", updatedTask);
        setTasks(tasks.map(task => task._id === taskId ? { ...task, status: updatedTask.status } : task));
      } else {
        const errorResponse = await response.json();
        console.error("Failed to update task status:", errorResponse);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleLeaveWorkspace = async (workspaceId, ownerId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const userId = jwt.decode(token).id; // Assuming the token has the userId in the payload
  
    // Prevent leaving if the user is the owner
    if (userId === ownerId) {
      alert("You cannot leave the workspace as the owner.");
      return;
    }
  
    try {
      const response = await fetch("/api/workspaces/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workspaceId }),
      });
  
      if (response.ok) {
        setWorkspaces((prevWorkspaces) =>
          prevWorkspaces.filter((workspace) => workspace._id !== workspaceId)
        );
      } else {
        console.error("Failed to leave workspace");
      }
    } catch (error) {
      console.error("Error leaving workspace:", error);
    }
  };
  

  const handleDeleteWorkspace = async (workspaceId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await fetch(`/api/workspaces`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workspaceId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setWorkspaces((prevWorkspaces) =>
            prevWorkspaces.filter((workspace) => workspace._id !== workspaceId)
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      alert("An error occurred while deleting the workspace.");
    }
  };
  
  
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    const filteredtask = tasks
  .filter((task) => {
    // Check if the task matches the search query
    const matchesSearchQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if the task's status matches the filter or if 'ALL' is selected
    const matchesStatus =
      statusFilter === 'ALL' || task.status === statusFilter;

    // Check if the task is past due (only for the 'PAST_DUE' filter)
    const isPastDue =
      statusFilter === 'PAST_DUE' &&
      task.deadline &&
      new Date(task.deadline) < new Date() &&
      task.status !== 'COMPLETED';

    // Return the task if it matches both the status and search query
    return (
      (matchesStatus || (statusFilter === 'PAST_DUE' && isPastDue)) &&
      matchesSearchQuery
    );
  })
  .sort((a, b) => new Date(b.deadline) - new Date(a.deadline));


  const handleStatusClick = (status) => {
    setStatusFilter(status);
  };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString("en-US", options);
      };

     

  return (
    <div className="collab-workspace-container">
        <div className="up-logo-collab">
            <Image src="/studbud-logo.svg" alt="logo" width={80} height={80} />
            <div className="quotes-collab">
            {quote ? (
                <>
                <p>"{quote.q}"</p>
                <p>- {quote.a}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
            </div>
            <div className="back-workspace" onClick={navigateToOriginal}>
                <h3><TfiArrowLeft /></h3>
                <h4> Back to Own Workspace</h4>
            </div>
        </div>

        <div className="main-collabspace">

        <div className="workspace-list">
        <h3>Workspaces</h3>
        <div className="workspace-items-container">
            {workspaces.length === 0 ? (
                <p>No workspaces available.</p>
            ) : (
                workspaces.map((workspace) => (
                    <div
                        className="workspace-items"
                        key={workspace._id}
                        onClick={() => handleWorkspaceClick(workspace)}
                    >
                        <div className="w-title">
                            <h4>{workspace.title}</h4>
                            <h5 onClick={(e) => { 
                                e.stopPropagation(); 
                                toggleWorkspaceOption(workspace._id);
                            }}>
                                <TfiMoreAlt />
                            </h5>
                        </div>
                        <p>{workspace.description}</p>

                        {openWorkspaceID === workspace._id && (
                            <div className="workspaceOptions">
                                <button
                                    onClick={() => handleLeaveWorkspace(workspace._id)}
                                    disabled={workspace.owner === user._id}
                                    className="leave-button"
                                >
                                    Leave Workspace
                                </button>

                                {workspace.owner === user._id && (
                                    <div className="ownerOnlyOptions">
                                        <span>
                                        {copiedWorkspace === workspace._id && <span className="copied-message">Copied!</span>}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(workspace._id);
                                                setCopiedWorkspace(workspace._id); // Set copied state
                                                setTimeout(() => setCopiedWorkspace(null), 2000); // Hide after 2 seconds
                                            }}
                                        >
                                            <TfiClipboard />
                                        </button>
                                        Join Code: {workspace._id}
                                        </span>

                                        <button disabled className="owner-disabled-button">
                                            You cannot leave as the owner, delete workspace instead.
                                        </button>
                                        <button className="owner-delete" onClick={() => handleDeleteWorkspace(workspace._id)}>
                                            Delete Workspace
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>

        <div className="middle-workspace">
            <div className="collab-workspace-title">
            {activeWorkspace && (
                <>
                {isEditingTitle ? (
                    <div className="collab-title-edit">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={handleTitleChange}
                    />
                    <button onClick={saveEditedTitle}>Save</button>
                    <button onClick={toggleEditTitle}>Cancel</button>
                    </div>
                ) : (
                    <h2>{activeWorkspace.title}</h2>
                )}
                </>
            )}

            {isWorkspaceSettingsOpen && (
                    <div ref={settingsRef} className="collab-workspace-settings-title">
                    <ul>
                    <li onClick={openCreateWorkspaceModal}>Create Workspace</li>
                    <li onClick={openJoinWorkspaceModal}>Join Workspace</li>
                    {activeWorkspace?.owner === user._id && !isEditingTitle && (
                        <li onClick={toggleEditTitle}>Edit Workspace Title</li>
            )}
                
            </ul>
            </div>
        )}
            
            <h3 className="ellipsis" onClick={toggleWorkspaceSettings}><TfiMoreAlt /></h3>
            </div>

            <div className="choose-tool">
                
                <button
                    className={activeTool === "NOTE" ? "active-tool" : ""}
                    onClick={() => handleToolClick("NOTE")}
                >
                    NOTE
                </button>
                <button
                    className={activeTool === "TASK" ? "active-tool" : ""}
                    onClick={() => handleToolClick("TASK")}
                >
                    TASK
                </button>
                

            </div>

            <div className="tool-viewer">
            {activeWorkspace ? (
    <>
                {activeTool === "NOTE" && (
                    <div className="note-tool">
                        <div className="note-tool-left">
                        <h2>Create Note</h2>
                        <form onSubmit={handleAddNote}>
                            <input
                            type="text"
                            placeholder="Enter note title"
                            value={newCollabNoteTitle}
                            onChange={handleNoteTitleChange} 
                            onKeyDown={handleKeyDown}
                            required
                        />
                        <textarea
                        placeholder="Write a note..."
                        value={newCollabNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                        />
                        <button className="collab-submit" type="submit">Add Note</button>
                    </form>


                        </div>
                    
                        <div className="note-list">
                        <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        />

                        {/* Filtered Notes */}
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                                <div
                                key={note._id}
                                className="note-item"
                                onClick={() => setSelectedNote(note)}
                                >
                                <h3>{note.title}</h3>
                                <p>
                                    {note.content.length > 50 ? `${note.content.slice(0, 50)}...` : note.content}
                                </p>
                                <span className="note-by"><strong>Note by: </strong>{note.owner.name}</span>
                                </div>
                            ))
                            ) : (
                            <div className="no-available">
                            <p>No notes found</p>
                            </div>
                            )}
                        </div>

                        <div className="note-viewer">
                        {selectedNote ? (
                          <div className="viewed-note">
                            <div className="note-editing">
                              {isEditing ? (
                                <div className="activate-edit-note">
                                  <input
                                    type="text"
                                    value={editedNotetitle}
                                    onChange={(e) => {
                                      if (e.target.value.length <= 50) {
                                        setEditedNoteTitle(e.target.value);
                                      }
                                    }}
                                    className="edit-title-input"
                                  />
                                  <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                  />
                                  <div className="collab-buttons">
                                    <button className="collab-submit" onClick={handleSaveEdit}>Save</button>
                                    <button className="collab-close" onClick={handleCancelEdit}>Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h2>{selectedNote.title}</h2>
                                  <div className="note-edit-tools">
                                    <span 
                                      onClick={handleEditClick} 
                                      style={{ 
                                        pointerEvents: selectedNote.owner && selectedNote.owner._id !== user._id ? 'none' : 'auto', 
                                        opacity: selectedNote.owner && selectedNote.owner._id !== user._id ? 0.5 : 1 
                                      }}
                                    >
                                      <TfiPencilAlt />
                                    </span>
                                    <span 
                                      onClick={handleDeleteClick} 
                                      style={{ 
                                        pointerEvents: selectedNote.owner && selectedNote.owner._id !== user._id ? 'none' : 'auto', 
                                        opacity: selectedNote.owner && selectedNote.owner._id !== user._id ? 0.5 : 1 
                                      }}
                                    >
                                      <TfiTrash />
                                    </span>
                                    <span 
                                      onClick={() => handleDownloadNoteAsPDF(selectedNote.title, selectedNote.content)} 
                                      
                                    >
                                      <TfiDownload /> {/* Download as PDF icon */}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="other-note-details">
                              <span><strong>Note by: </strong>{selectedNote.owner.name}</span>
                              <span><strong>Created at: </strong>{formatDate(selectedNote.createdAt)}</span>
                            </div>
                            {!isEditing && <p>{selectedNote.content}</p>}
                          </div>
                        ) : (
                          <p>Click a note to view details</p>
                        )}

                        {showDeleteModal && (
                          <DeleteConfirmationModal 
                            onConfirm={handleConfirmDelete} 
                            onCancel={handleCancelDelete} 
                          />
                        )}
                      </div>
                    </div>
                )}

            {activeTool === "TASK" && (
            <div className="task-tool">
                <div className="task-tool-left">
                    <h2>Create Task</h2>
            <form onSubmit={handleAddTask}>
                <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                />
                <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                <option value="">Assign to...</option>
                {members.map((member) => (
                    <option key={member._id} value={member._id}>
                    {member.name}
                    </option>
                ))}
                </select>
                <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
                />
                
                <input
                    type="date"
                    placeholder="Deadline"
                    value={newTask.deadline || ""}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                <button className="collab-submit" type="submit">Add Task</button>
            </form>
                </div>
        
                <div className="collab-task-list">
                <div className="task-status">
                <button
                onClick={() => handleStatusClick('TODO')}
                disabled={statusFilter === 'TODO'}
                className={statusFilter === 'TODO' ? 'active' : ''}
                >
                To-Do
                </button>
                <button
                onClick={() => handleStatusClick('IN_PROGRESS')}
                disabled={statusFilter === 'IN_PROGRESS'}
                className={statusFilter === 'IN_PROGRESS' ? 'active' : ''}
                >
                In Progress
                </button>
                <button
                onClick={() => handleStatusClick('COMPLETED')}
                disabled={statusFilter === 'COMPLETED'}
                className={statusFilter === 'COMPLETED' ? 'active' : ''}
                >
                Completed
                </button>
                <button
                onClick={() => handleStatusClick('PAST_DUE')}
                disabled={statusFilter === 'PAST_DUE'}
                className={statusFilter === 'PAST_DUE' ? 'active' : ''}
                >
                Past Due
                </button>
            </div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            
            {filteredtask.length > 0 ? (
                filteredtask.map((task) => (
                <div
                    key={task._id}
                    className={`task-item ${selectedTaskId === task._id ? "selected" : ""}`}
                    onClick={() => handleTaskClick(task._id)}
                >
                    <h4>{task.title}</h4>
                    <h6>{task.description}</h6>
                    <p>
                    <strong>Assigned to:</strong> {task.assignee ? task.assignee.name : "Not Assigned"}
                    </p>
                    <p>
                    <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "No Deadline"}
                    </p>
                </div>
                ))
            ) : (
                <div className="no-available">
                <p>No tasks available for this workspace.</p>
                </div>
            )}
                </div>


                <div className="task-viewer">
            {selectedTask ? (
                <>
                <div className="task-editing">
                    <h2>{selectedTask.title}</h2>
                    <div className="task-edit-tools">
                    <span>Edit<TfiPencilAlt /></span>
                    <span onClick={() => handleTaskDeleteClick(selectedTask._id)}>
  <TfiTrash />
</span>
                    </div>
                </div>
                <div className="task-details">
                    <div className="other-task-details">
                        <div className="assigning-details">
                        <p><strong>Assigned to:</strong> {selectedTask.assignee ? selectedTask.assignee.name : "Not Assigned"}</p>
                        <p><strong>Assignor:</strong> {selectedTask.assignor ? selectedTask.assignor.name : "Not Assigned"}</p>
                        </div>
                    <p><strong>Deadline:</strong> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "No Deadline"}</p>
                    </div>
                    <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask._id, e.target.value)}
                    disabled={selectedTask.assignee && selectedTask.assignee._id !== user._id}
                    >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    </select>

                    <p><strong>Description:</strong> {selectedTask.description}</p>
                </div>
                </>
            ) : (
                <p className="text-gray-500">Click a task to view details</p>
            )}

{showDeleteTaskModal && (
  <DeleteConfirmationModal
    onConfirm={handleConfirmDeleteTask} 
    onCancel={handleCancelDeleteTask} 
  />
)}
            </div>

            </div>
            )}
            </>
            ) : (
              <div className="no-workspace-selected">
                <p>Please select a workspace to view notes or tasks.</p>
              </div>
            )}
            
            </div>
        </div>



            {isJoinWorkspaceModalOpen && (
        <div className="collab-modal-overlay">
            <div className="collab-modal-content">
            <h3>Join Workspace by ID</h3>
            <form onSubmit={handleJoinById}>
                <input
                type="text"
                placeholder="Enter Workspace ID"
                value={workspaceIdToJoin}
                onChange={(e) => setWorkspaceIdToJoin(e.target.value)}
                />
                <div className="collab-buttons">
            <button className="collab-submit" type="submit" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Workspace"}
                </button>
            <button className="collab-close" onClick={closeJoinWorkspaceModal}>Close</button>
            </div>
            </form>
            
            </div>
        </div>
        )}

            {isCreateWorkspaceModalOpen && (
        <div className="collab-modal-overlay">
            <div className="collab-modal-content">
            <h3>Create New Workspace</h3>
            <form onSubmit={handleCreateWorkspace}>
            <input
                type="text"
                placeholder="Workspace Title"
                value={newWorkspaceTitle}
                onChange={(e) => setNewWorkspaceTitle(e.target.value.slice(0, 40))}
                maxLength={40}
                required
              />
                <textarea
                placeholder="Workspace Description"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value.slice(0,100))}
                required
                style={{ resize: "none" }} 
                />
                <div className="collab-buttons">
            <button className="collab-submit" type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Workspace"}
                </button>
            <button className="collab-close" onClick={closeCreateWorkspaceModal}>Close</button>
            </div>
            </form>
            
            </div>
        </div>
        )}

        
            <div className="members-list">
            <h3>Members</h3>
            {activeWorkspace && (
            <ul>
                {activeWorkspace.members.map((member) => (
                    <li key={member._id}>{member.name}</li>
                ))}
                </ul>
                )}

            </div>
        
        
        </div>
    </div>
  );
}
