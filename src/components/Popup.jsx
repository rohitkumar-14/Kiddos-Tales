import React from 'react'
import { NavLink } from 'react-router-dom';

const Popup = ({ onClose }) => (
    <div style={popupStyles}>
      <div style={popupContentStyles}>
        <h2>Story Generated!</h2>
        <p>Your story has been successfully created. You can explore more content now.</p>
        <NavLink to="/explore" onClick={onClose} style={linkStyles}>Go to Explore Page</NavLink>
      </div>
    </div>
  );

export default Popup
const popupStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  };
  
  const popupContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  };
  
  const linkStyles = {
    color: '#10D3C3', 
    textDecoration: 'none',
    fontWeight: 'bold',
  };