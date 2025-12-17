import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate, Link } from 'react-router-dom';

import landingBg from '../assets/landingpage.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      
      
      localStorage.setItem('user', JSON.stringify(response.data));
      
      console.log('Login Successful!', response.data); 
      
      
      if (response.data.type === 'School') {
        navigate('/school-dashboard');
      } else {
        navigate('/company-dashboard');
      }
    } catch (error) {
      alert('Login Failed: ' + (error.response?.data?.detail || 'Invalid credentials'));
    }
  };


  const pageContainerStyle = {
    backgroundImage: `url(${landingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.75)', 
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', sans-serif",
  };

  const loginBoxStyle = {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    backgroundColor: 'rgba(30, 30, 30, 0.6)', 
    backdropFilter: 'blur(15px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    color: 'white'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '30px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'linear-gradient(to right, #00c6ff, #9646ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(0, 198, 255, 0.3))',
  };

  const getInputStyle = (fieldName) => ({
    padding: '15px',
    fontSize: '16px',
    borderRadius: '10px',
    border: focusedInput === fieldName ? '2px solid #00c6ff' : '2px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedInput === fieldName ? '0 0 15px rgba(0, 198, 255, 0.5)' : 'none',
  });

  const buttonStyle = {
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    backgroundImage: 'linear-gradient(to right, #00c6ff 0%, #ff0099 100%)',
    boxShadow: '0 10px 20px -10px rgba(255, 0, 153, 0.5)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginTop: '10px',
    width: '100%'
  };

  const linkContainerStyle = {
    marginTop: '25px',
    fontSize: '14px',
    color: '#ccc',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const linkStyle = {
    color: '#00c6ff', 
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease'
  };

  const addHover = (e) => { 
    e.currentTarget.style.transform = 'translateY(-3px)'; 
    e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(255, 0, 153, 0.7)'; 
  }
  const removeHover = (e) => { 
    e.currentTarget.style.transform = 'translateY(0)'; 
    e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(255, 0, 153, 0.5)'; 
  }

  return (
    <div style={pageContainerStyle}>
      <div style={loginBoxStyle}>
        <h2 style={titleStyle}>Login</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            style={getInputStyle('email')}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            style={getInputStyle('password')}
          />
          <button 
            type="submit" 
            style={buttonStyle}
            onMouseOver={addHover} onMouseOut={removeHover}
          >
            LOGIN
          </button>
        </form>

        <div style={linkContainerStyle}>
          <div>
            <Link to="/forgot-password" style={linkStyle} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#00c6ff'}>
              Forgot Password?
            </Link>
          </div>
          <div>
            Don't have an account?{' '}
            <Link to="/signup" style={linkStyle} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#00c6ff'}>
              Sign Up Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;