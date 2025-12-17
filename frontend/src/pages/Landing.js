import React from 'react';
import { useNavigate } from 'react-router-dom';
import landingBg from '../assets/landingpage.jpg';

function Landing() {
  const navigate = useNavigate();

  const containerStyle = {
    backgroundImage: `url(${landingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.7)', 
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
    overflow: 'hidden'
  };

  const titleStyle = {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '900',
    marginTop: '4vh',
    marginBottom: '4vh',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'linear-gradient(to right, #00c6ff, #9646ff, #ff0099)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    filter: 'drop-shadow(0 0 15px rgba(150, 70, 255, 0.5)) drop-shadow(0 0 30px rgba(0, 198, 255, 0.3))',
  };

  const splitLayoutContainer = {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    maxWidth: '1200px',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4rem',
    paddingBottom: '50px',
    flexWrap: 'wrap'
  };

  const leftInfoStyle = {
    flex: '1 1 400px',
    textAlign: 'left',
    padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  };

  const mainPointStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ffffff',
    lineHeight: '1.2'
  };

  const subTextStyle = {
    fontSize: '1.2rem',
    color: '#d0d0d0',
    lineHeight: '1.6',
    maxWidth: '500px'
  };

  const rightButtonStyle = {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const buttonBaseStyle = {
    padding: '25px 20px',  
    fontSize: '24px',
    fontWeight: '800',
    cursor: 'pointer',
    color: 'white',
    borderRadius: '20px',
    width: '400px',       
    maxWidth: '90vw', 
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    display: 'flex',        
    justifyContent: 'center',
    alignItems: 'center'
  };

  const donateBtnStyle = {
    ...buttonBaseStyle,
    backgroundImage: 'linear-gradient(135deg, #021B79 0%, #0575E6 100%)',
    border: '3px solid #00c6ff', 
    boxShadow: '0 0 25px rgba(0, 198, 255, 0.6)', 
  };

  const requestBtnStyle = {
    ...buttonBaseStyle,
    backgroundImage: 'linear-gradient(135deg, #3b26c5 0%, #8935e9 100%)',
    border: '3px solid #d4aaff', 
    boxShadow: '0 0 25px rgba(180, 100, 255, 0.6)',
  };

  const handleDonateHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 198, 255, 1)';
    e.currentTarget.style.border = '3px solid #ffffff';
  }

  const handleDonateLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 198, 255, 0.6)';
    e.currentTarget.style.border = '3px solid #00c6ff';
  }

  const handleRequestHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 0 50px rgba(180, 100, 255, 1)';
    e.currentTarget.style.border = '3px solid #ffffff';
  }

  const handleRequestLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 0 25px rgba(180, 100, 255, 0.6)';
    e.currentTarget.style.border = '3px solid #d4aaff';
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>TechWithTech</h1>

      <div style={splitLayoutContainer}>
        <div style={leftInfoStyle}>
          <h2 style={mainPointStyle}>
            Connect Tech with <span style={{color: '#00c6ff'}}>Future Techies</span>
          </h2>
          <p style={subTextStyle}>
            We are the bridge connecting cutting-edge software companies directly with schools. We facilitate the donation of vital resources to empower the next generation of innovators.
          </p>
        </div>

        <div style={rightButtonStyle}>
          <button 
            onClick={() => navigate('/login')} 
            style={donateBtnStyle}
            onMouseOver={handleDonateHover} 
            onMouseOut={handleDonateLeave}
          >
            Corporations: Donate
          </button>

          <button 
            onClick={() => navigate('/login')} 
            style={requestBtnStyle}
            onMouseOver={handleRequestHover} 
            onMouseOut={handleRequestLeave}
          >
            Schools: Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;