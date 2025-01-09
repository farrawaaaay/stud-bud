"use client"; // Marks the file as a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const NotesPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNote = { title, content, category };

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });

    if (res.ok) {
      const data = await res.json();
      setNotes([...notes, data]); // Add the new note to the list
      setTitle('');
      setContent('');
      setCategory('');
    } else {
      console.error('Failed to create note');
    }
  };

  return (
    <div>
      <h1>Notes</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <button type="submit">Create Note</button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p><strong>Category:</strong> {note.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesPage;
