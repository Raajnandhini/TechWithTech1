import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 60) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderLinks = () => {
    if (location.pathname === '/' || location.pathname === '/signup') {
      return (
        <Link to="/" style={styles.link}>Home</Link>
      );
    }

    if (user && user.type === 'Company') {
      return (
        <>
          <Link to="/company-dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/create-donation" style={styles.link}>+ New Donation</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>LogOut</button>
        </>
      );
    }

    if (user && user.type === 'School') {
      return (
        <>
          <Link to="/school-dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/create-request" style={styles.link}>+ New Request</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>LogOut</button>
        </>
      );
    }

    return <Link to="/" style={styles.link}>Home</Link>;
  };

  return (
    <nav style={{ ...styles.nav, top: isVisible ? '0' : '-70px' }}>
      
      <div style={styles.brand}>
        TechWithTech
      </div>

      <div style={styles.links}>
        {user && location.pathname !== '/' && location.pathname !== '/signup' && (
          <span style={styles.userGreeting}>Hi, {user.name}</span>
        )}
        
        {renderLinks()}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    height: '60px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    position: 'fixed', 
    left: 0,
    width: '100%',
    zIndex: 1000, 
    transition: 'top 0.3s ease-in-out', 
    backdropFilter: 'blur(8px)', 
    boxSizing: 'border-box',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  },
  brand: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#fff',
    textTransform: 'uppercase'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  userGreeting: {
    color: '#bdc3c7',
    fontSize: '0.9rem',
    marginRight: '10px',
    fontStyle: 'italic'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c', 
    color: 'white',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s'
  }
};

export default Navbar;