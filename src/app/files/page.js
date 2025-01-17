'use client';

import { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
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
        setUploadedFile(result.fileUrl || result.fileName); // Store the uploaded file's URL or name
      } else {
        setStatusMessage(result.error || 'Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatusMessage('Error uploading file.');
    }
  };

  // Handle file view (open file or show preview)
  const handleFileView = () => {
    if (uploadedFile) {
      // Assuming uploadedFile contains the URL of the uploaded file
      window.open(uploadedFile, '_blank');
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
        {previewUrl && (
          <div>
            <h2>File Preview:</h2>
            <img src={previewUrl} alt="Preview" width={200} height={200} />
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}

      {/* Show uploaded file icon */}
      {uploadedFile && (
        <div>
          <h2>Uploaded File:</h2>
          <div
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={handleFileView}
          >
            <i className="fas fa-file-alt"></i> {/* Use any icon library */}
            <span>{uploadedFile}</span>
          </div>
        </div>
      )}
    </div>
  );
}
