"use client"; // Marks the file as a Client Component

import { useState, useEffect } from "react";
import { TfiTrash, TfiPencilAlt, TfiDownload } from "react-icons/tfi"; // Added TfiDownload for the download icon
import { jsPDF } from "jspdf"; // Import jsPDF
import "../../styles/note.css";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // New state for form visibility
  const [expandedNote, setExpandedNote] = useState(null);  // State to track expanded notes
  const [filter, setFilter] = useState(""); // State to track the selected filter (tag)
  const [tags, setTags] = useState([]); // State to track the unique tags
  const [search, setSearch] = useState(""); // State to track the search query
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation modal
  const [noteToDelete, setNoteToDelete] = useState(null); // State to store the note ID to delete

  // Retrieve the token (assuming it's stored in localStorage after login)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) {
        alert("You must be logged in to view notes.");
        return;
      }

      const res = await fetch("/api/notes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Sort the notes by the `updatedAt` field in descending order (latest first)
        const sortedNotes = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(sortedNotes);

        // Extract unique tags from the notes and set them
        const uniqueTags = [...new Set(data.map(note => note.category))];
        setTags(uniqueTags);
      } else {
        const error = await res.json();
        console.error("Failed to fetch notes:", error);
        alert(`Error: ${error.error}`);
      }
    };

    fetchNotes();
  }, [token]);

  const handleToggle = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);  // Toggle the note's expanded state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNote = { title, content, category };
  
    if (!token) {
      alert("You must be logged in to create or update notes.");
      return;
    }

    if (!title || !content || !category) {
      setModalMessage("Please fill out all required fields.");
      return;
    }

    const url = editingNoteId ? `/api/notes/${editingNoteId}` : "/api/notes";
    const method = editingNoteId ? "PUT" : "POST";
  
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newNote),
    });
  
    if (res.ok) {
      const data = await res.json();
      if (editingNoteId) {
        // Update the existing note in the state
        setNotes(notes.map((note) => (note._id === editingNoteId ? data : note)));
        setEditingNoteId(null); 
        setModalMessage("Note edited!");
      } else {
        // Add the new note to the state
        setNotes([data, ...notes]);
        setModalMessage("Note created!");
      }
  
      // Reset the form
      setTitle("");
      setContent("");
      setCategory("");
      setIsFormVisible(false);
  
      // Update tags if necessary
      if (!tags.includes(data.category)) {
        setTags([...tags, data.category]);
      }
    } else {
      const error = await res.json();
      console.error("Failed to save note:", error);
      alert(`Error: ${error.error}`);
    }
  };

  const handleEdit = async (noteId) => {
    const noteToEdit = notes.find((note) => note._id === noteId);
    if (!noteToEdit) return;
  
    // Populate the form with the note's data
    setTitle(noteToEdit.title);
    setContent(noteToEdit.content);
    setCategory(noteToEdit.category);
    setIsFormVisible(true);
    // Store the note ID for updating
    setEditingNoteId(noteId);
  };
  
  const handleDelete = (noteId) => {
    setNoteToDelete(noteId); // Set the note ID to delete
    setIsDeleteModalVisible(true); // Show the delete confirmation modal
  };

  const confirmDelete = async () => {
    if (!noteToDelete || !token) {
      setModalMessage("Invalid request or not logged in.");
      return;
    }

    const res = await fetch(`/api/notes/${noteToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      // Remove the deleted note from the state
      setNotes(notes.filter((note) => note._id !== noteToDelete));
      setModalMessage("Note deleted!");
    } else {
      const error = await res.json();
      console.error("Failed to delete note:", error);
      setModalMessage(`Error: ${error.error}`);
    }

    setIsDeleteModalVisible(false); // Close the modal
    setNoteToDelete(null); // Reset the note ID to delete
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false); // Close the modal
    setNoteToDelete(null); // Reset the note ID to delete
  };

  const handleKeyDown = (e) => {
    const { value } = e.target;
    if (e.key === ' ' && value.length === 0) e.preventDefault();
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setIsFormVisible(false); // Close the modal without saving
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Set the filter to the selected tag
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.trimStart()); // Remove leading spaces before updating the state
  };

  // Function to handle downloading a note as a PDF
  const handleDownloadPDF = (note) => {
    const doc = new jsPDF();
    

    // Set font and size
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);

    // Add title
    doc.text(note.title, 10, 10);

    // Add content
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(note.content, 180); // Wrap text to fit within 180mm width
    doc.text(splitContent, 10, 20);

    // Add metadata (tag and date)
    doc.setFontSize(10);
    doc.text(`Tag: ${note.category}`, 10, doc.internal.pageSize.height - 20);
    doc.text(`Date: ${new Date(note.updatedAt).toLocaleString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric", 
      hour: "numeric", 
      minute: "numeric", 
      second: "numeric", 
      hour12: true 
    })}`, 10, doc.internal.pageSize.height - 10);

    // Save the PDF
    doc.save(`${note.title}.pdf`);
    setModalMessage("Note downloaded!");
  };

  // Filtered notes based on the selected category/tag and search term
  const filteredNotes = notes
    .filter((note) => (filter ? note.category.toLowerCase().includes(filter.toLowerCase()) : true))
    .filter((note) => (search ? note.content.toLowerCase().includes(search.toLowerCase()) : true));

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

  const ConfirmDeleteModal = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;
  
    return (
      <div className="popup-overlay" onClick={onCancel}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <p>Are you sure you want to delete this note?</p>
          <div className="popup-buttons">
            <button className="cancel-note" onClick={onConfirm}>Confirm</button>
            <button className="create-note" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="note-container">
      <div className="note-header">
        <h1>Notes</h1>
        <button className="add-note" onClick={() => setIsFormVisible(true)}>+ Add</button>
      </div>
      
      {/* Filter dropdown */}
      <div className="filter-container" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Search box */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search in content"
          style={{
            display: "block",
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <select
          value={filter}
          onChange={handleFilterChange}
          style={{ display: "block", padding: "5px" }}
          className="selections"
        >
          <option value="">Select Tag</option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "10px 0" }}>
        {/* Check if filteredNotes has any content */}
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note._id} className="display-note">
              <div className="note-content">
                <div className="note-title-header">
                  <h3>{note.title}</h3>
                  <div>
                    <button onClick={() => handleEdit(note._id)}><TfiPencilAlt /></button>
                    <button onClick={() => handleDelete(note._id)}><TfiTrash /></button>
                    <button onClick={() => handleDownloadPDF(note)}><TfiDownload /></button> {/* Download button */}
                  </div>
                </div>
                <p>
                  {expandedNote === note._id
                    ? note.content  // Show full content if expanded
                    : `${note.content.slice(0, 100)}`}  
                </p>
                {note.content.length > 100 && (
                  <button onClick={() => handleToggle(note._id)} className="show-more">
                    {expandedNote === note._id ? 'See Less' : 'See More'}
                  </button>
                )}
              </div>
              <div className="note-details">
                <p><strong>Tag:</strong> {note.category}</p>
                <p><strong>Date:</strong> {new Date(note.updatedAt).toLocaleString("en-US", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric", 
                  hour: "numeric", 
                  minute: "numeric", 
                  second: "numeric", 
                  hour12: true 
                })}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No notes available</p> // Display this message when no notes are present
        )}
      </div>

      {/* Modal Form */}
      {isFormVisible && (
        <div className="note-modal-overlay" onClick={() => setIsFormVisible(false)}>
          <div className="note-modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="note-form">
              <p className="note-form-title">Note title: *</p>
              <input
                type="text"
                value={title}
                onChange={(e) => e.target.value.length <= 50 && setTitle(e.target.value)}
                placeholder="Title"
                style={{ display: "block", marginBottom: "10px" }}
                onKeyDown={handleKeyDown} 
              />
              <p className="note-form-title">Note content: *</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                onKeyDown={handleKeyDown} 
              />
              <p className="note-form-title">Tag title: *</p>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Tag"
                style={{ display: "block", marginBottom: "10px" }}
                onKeyDown={handleKeyDown} 
              />
              <div className="note-buttons">
                <button type="submit" className="create-note">Create</button>
                <button className="cancel-note" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Modal for Messages */}
      <PopupModal message={modalMessage} onClose={() => setModalMessage("")} />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isVisible={isDeleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default Notes;