import React from 'react';

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <>
      <style jsx>{`
        /* Modal Overlay */
        .delete-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        /* Modal Content */
        .delete-modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          width: 300px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Button styles */
        .delete-modal-actions button {
          margin: 10px;
          padding: 8px 15px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
        }

        .delete-btn-confirm {
          background-color: #e74c3c;
          color: white;
        }

        .delete-btn-cancel {
          background-color: #2ecc71;
          color: white;
        }
      `}</style>

      <div className="delete-modal-overlay">
        <div className="delete-modal-content">
          <h3>Are you sure you want to delete this?</h3>
          <div className="delete-modal-actions">
            <button onClick={onConfirm} className="delete-btn-confirm">Yes</button>
            <button onClick={onCancel} className="delete-btn-cancel">No</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
