// src/components/common/LoginPromptModal.jsx
// Modal component to prompt user to login for wishlist operations

import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, title = "Login Required", message = "Please log in to add items to your wishlist." }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="icon-lock text-primary me-2"></i>
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            <div className="mb-4">
              <i className="icon-heart text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <p className="mb-4">{message}</p>
            <div className="d-flex gap-3 justify-content-center">
              <Link 
                to="/login" 
                className="btn btn-primary"
                onClick={onClose}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-outline-primary"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
