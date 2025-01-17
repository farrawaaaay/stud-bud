"use client"; // Marks the file as a Client Component

import { useState, useEffect } from "react";
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
      alert("You must be logged in to create notes.");
      return;
    }

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token
      },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const data = await res.json();
      setNotes([data, ...notes]); // Add the new note to the beginning of the notes array
      setTitle("");
      setContent("");
      setCategory("");
      setIsFormVisible(false); // Hide the form after submission

      // Update the tags if the new note has a unique tag
      if (!tags.includes(data.category)) {
        setTags([...tags, data.category]);
      }
    } else {
      const error = await res.json();
      console.error("Failed to create note:", error);
      alert(`Error: ${error.error}`);
    }
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
    setSearch(e.target.value); // Set the search query
  };

  // Filtered notes based on the selected category/tag and search term
  const filteredNotes = notes
    .filter((note) => (filter ? note.category.toLowerCase().includes(filter.toLowerCase()) : true))
    .filter((note) => (search ? note.content.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <div className="note-container">
      <h1>Notes</h1>
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

      <button className="add-note" onClick={() => setIsFormVisible(true)}>+ Add Note</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "10px 0" }}>
        {filteredNotes.map((note) => (
          <div key={note._id} className="display-note">
            <div className="note-content">
              <h3>{note.title}</h3>
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
        ))}
      </div>

      <div className="line-boundary"> </div>

      <button className="add-note" onClick={() => setIsFormVisible(true)}>+ Add Note</button>

      {/* Modal Form */}
      {isFormVisible && (
        <div className="modal-overlay" onClick={() => setIsFormVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit} className="note-form">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                style={{ display: "block", marginBottom: "10px" }}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                style={{
                  display: "block",
                  marginBottom: "10px",
                  height: "100px",
                  resize: "none", // Prevent resizing
                }}
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Tag"
                style={{ display: "block", marginBottom: "10px" }}
              />
              <div className="note-buttons">
                <button type="submit" className="create-note">Create</button>
                <button className="cancel-note" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
