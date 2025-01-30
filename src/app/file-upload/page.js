'use client'

import { useState, useEffect } from "react";
import "../../styles/files.css";
import { TfiTrash } from "react-icons/tfi";
import jwt from "jsonwebtoken";
import { ClipLoader } from 'react-spinners';

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [folder, setFolder] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Popup Modal Component
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

  // Toggle Modal for Uploading Files
  const toggleModal = () => {
    if (!selectedFolder) {
      setStatusMessage("Please select a folder to upload files.");
      return;
    }
    setShowUploadFile(!showUploadFile);
  };

  // Fetch Folders on Component Mount
  useEffect(() => {
    fetchFolders();
  }, []);

  // Fetch Folders from API
  const fetchFolders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    fetch("/api/getFolder", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.folders) {
          setFolders(data.folders);
        }
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
      });
  };

  // Fetch Uploaded Files for a Specific Folder
  const fetchUploadedFiles = async (folderName) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setStatusMessage("Please log in to upload files.");
        return;
      }

      const response = await fetch(`/api/upload?folderName=${folderName}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.files && data.files.length === 0) {
          setStatusMessage("No files found in this folder.");
          setFiles([]);
        } else {
          setFiles(data.files || []);
          setStatusMessage("");
        }
      } else {
        setStatusMessage("Failed to retrieve files.");
      }
    } catch (error) {
      console.error("Error retrieving files:", error);
      setStatusMessage("An error occurred while fetching files.");
    }
  };

  // Handle Folder Name Input Change
  const handleFolderChange = (e) => {
    setFolder(e.target.value);
  };

  // Add a New Folder
  const handleAddFolder = (e) => {
    e.preventDefault();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const studentID = token ? jwt.decode(token).id : null;

    if (!folder.trim() || !token || !studentID) {
      console.error("Missing folder name, token, or student ID.");
      return;
    }

    fetch("/api/addFolder", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName: folder, studentID: studentID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Folder added successfully") {
          setFolders((prev) => [...prev, data.folder]);
          setFolder(""); // Clear input after adding folder
          setStatusMessage("Folder added successfully!");
        }
      })
      .catch((error) => {
        console.error("Error adding folder:", error);
      });
  };

  // Handle File Deletion
  const handleDeleteFile = (fileId) => {
    setFileToDelete(fileId);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setStatusMessage("Please log in to delete files.");
      return;
    }

    try {
      const response = await fetch(`/api/deleteFile?fileId=${fileToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage("File deleted successfully.");
        fetchUploadedFiles(selectedFolder);
      } else {
        setStatusMessage("Failed to delete file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setStatusMessage("An error occurred while deleting the file.");
    } finally {
      setIsDeleteModalVisible(false);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setFileToDelete(null);
  };

  // Toggle Form for Adding Folders
  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Handle Folder Click to Show Files
  const handleFolderClick = (folder) => {
    if (!folder || !folder.folderName) {
      setStatusMessage("Please select a valid folder.");
      return;
    }
    setSelectedFolder(folder.folderName);
    fetchUploadedFiles(folder.folderName);
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle File Upload
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file || !selectedFolder) {
      setStatusMessage("Please select a file and a folder.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setStatusMessage("Please log in to upload files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", selectedFolder);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("File uploaded successfully!");
        setShowUploadFile(false);
        fetchUploadedFiles(selectedFolder);
      } else {
        setStatusMessage("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatusMessage("An error occurred during file upload.");
    }
  };

  // Filter and Sort Folders
  const filteredFolders = folders
    .filter((folder) =>
      folder.folderName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by latest

  // Filter and Sort Files
  const filteredFiles = files
    .filter((file) =>
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by latest

  // Confirmation Modal Component
  const ConfirmDeleteModal = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
      <div className="popup-overlay" onClick={onCancel}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <p>Are you sure you want to delete this file?</p>
          <div className="popup-buttons">
            <button className="cancel-note" onClick={onConfirm}>Confirm</button>
            <button className="create-note" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="files-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search folders or files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Folder Title and Add Folder Button */}
      <div className="folder-title">
        <h1>Folders</h1>
        <button onClick={toggleForm}>+</button>
      </div>

      {/* Add Folder Form */}
      {showForm && (
        <form onSubmit={handleAddFolder} className="folder-form">
          <input
            type="text"
            placeholder="New Folder Name"
            value={folder}
            onChange={handleFolderChange}
          />
          <button type="submit">Add Folder</button>
        </form>
      )}

      {/* Folders List */}
      <div className="folders-container">
        <ul>
          {filteredFolders.map((folder, folderIndex) => (
            <li key={folderIndex} onClick={() => handleFolderClick(folder)}>
              <div className="folder">
                <img
                  src="/Folders.svg"
                  alt="Folder Icon"
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <h4>{folder.folderName}</h4>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border"></div>

      {/* Selected Folder and Upload File Button */}
      <div className="files-folder">
        <h3>{selectedFolder ? selectedFolder : "Select a Folder"}</h3>
        <button onClick={toggleModal}>+ Files</button>

        {/* Upload File Modal */}
        {showUploadFile && (
          <div className="file-modal">
            <div className="file-modal-content">
              <span className="folder-close-btn" onClick={toggleModal}>&times;</span>
              <h2>Upload File</h2>
              <form onSubmit={handleFileSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*,application/pdf,.txt,.docx" />
                <button className="submit-button" type="submit" disabled={loading}>
                  {loading ? <ClipLoader size={24} color="#ffffff" /> : 'Upload'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Files List */}
      <div className="files-list-container">
        {statusMessage && <p>{statusMessage}</p>}
        {filteredFiles.length === 0 && !statusMessage && (
          <p>No files found in this folder.</p>
        )}
        <ul>
          {filteredFiles.map((file, fileIndex) => (
            <li key={fileIndex}>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src="/Files.svg"
                  alt="File Icon"
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                {file.fileName}
              </a>
              <button onClick={() => handleDeleteFile(file._id)}><TfiTrash /></button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal for File Deletion */}
      <ConfirmDeleteModal
        isVisible={isDeleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Popup Modal for Messages */}
      <PopupModal message={statusMessage} onClose={() => setStatusMessage("")} />
    </div>
  );
};

export default Folders;