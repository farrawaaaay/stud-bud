'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file upload submission
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatusMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setStatusMessage('File uploaded successfully!');
        setUploadedFile(result.fileUrl || result.fileName); // Assume the server returns a URL
      } else {
        setStatusMessage(result.error || 'Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatusMessage('Error uploading file.');
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleFileSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,application/pdf,.txt,.docx"
        />
        <button type="submit">Upload</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}

      {/* Show uploaded file preview */}
      {uploadedFile && (
  <div>
    <h2>Uploaded File:</h2>
    <div
      style={{ cursor: 'pointer', color: 'blue', display: 'inline-flex', alignItems: 'center' }}
      onClick={() => window.open(uploadedFile, '_blank')}
    >
      <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i> {/* Use any icon library */}
      <span>{uploadedFile}</span>
    </div>

    {/* File preview */}
    <div style={{ marginTop: '20px' }}>
      {uploadedFile.endsWith('.jpg') || uploadedFile.endsWith('.png') || uploadedFile.endsWith('.jpeg') ? (
        <img src={uploadedFile} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />
      ) : uploadedFile.endsWith('.pdf') ? ( // Add support for PDF files
        <div style={{ marginTop: '20px' }}>
          <iframe
            src={uploadedFile}
            title="PDF Preview"
            style={{ width: '100%', height: '500px', border: 'none' }}
          ></iframe>
        </div>
      ) : uploadedFile.endsWith('.txt') ? (
        <iframe src={uploadedFile} title="File Preview" style={{ width: '100%', height: '400px' }}></iframe>
      ) : (
        <p>Preview not available. Click the link above to view the file.</p>
      )}
    </div>
  </div>
)}

    </div>
  );
}
