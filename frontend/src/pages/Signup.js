import React, { useState } from 'react';
import { signup } from '../api';
import { useNavigate } from 'react-router-dom';
import landingBg from '../assets/landingpage.jpg';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    contactName: '',
    phone: '',
    userType: 'School'
  });

  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const backendPayload = {
        email: formData.email,
        password: formData.password,
        name: formData.contactName, 
        phone: formData.phone,
        user_type: formData.userType, 
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      };

      await signup(backendPayload);
      alert('Signup Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      alert('Signup Failed: ' + (error.response?.data?.detail || 'Error'));
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
    padding: '40px 20px', 
    boxSizing: 'border-box'
  };

  const signupBoxStyle = {
    width: '100%',
    maxWidth: '550px',
    padding: '40px',
    backgroundColor: 'rgba(30, 30, 30, 0.6)', 
    backdropFilter: 'blur(15px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    color: 'white',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: 'linear-gradient(to right, #00c6ff, #9646ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(0, 198, 255, 0.3))',
  };

  const labelStyle = {
    textAlign: 'left',
    marginBottom: '5px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#ddd',
    marginLeft: '5px'
  };

  const getInputStyle = (fieldName) => ({
    padding: '12px',
    fontSize: '15px',
    borderRadius: '8px',
    border: focusedInput === fieldName ? '2px solid #00c6ff' : '2px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    outline: 'none',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
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
    marginTop: '20px',
    width: '100%'
  };

  const addHover = (e) => { 
    e.currentTarget.style.transform = 'translateY(-3px)'; 
    e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(255, 0, 153, 0.7)'; 
  }
  const removeHover = (e) => { 
    e.currentTarget.style.transform = 'translateY(0)'; 
    e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(255, 0, 153, 0.5)'; 
  }

  const handleFocus = (name) => setFocusedInput(name);
  const handleBlur = () => setFocusedInput(null);

  return (
    <div style={pageContainerStyle}>
      <div style={signupBoxStyle}>
        <h2 style={titleStyle}>New User Registration</h2>
        
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Login Email</label>
            <input 
              name="email" type="email" 
              value={formData.email} onChange={handleChange} 
              onFocus={() => handleFocus('email')} onBlur={handleBlur}
              style={getInputStyle('email')} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Password</label>
            <input 
              name="password" type="password" 
              value={formData.password} onChange={handleChange} 
              onFocus={() => handleFocus('password')} onBlur={handleBlur}
              style={getInputStyle('password')} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Address</label>
            <input 
              name="address1" placeholder="Line 1" 
              value={formData.address1} onChange={handleChange} 
              onFocus={() => handleFocus('address1')} onBlur={handleBlur}
              style={{ ...getInputStyle('address1'), marginBottom: '10px' }} 
            />
            <input 
              name="address2" placeholder="Line 2" 
              value={formData.address2} onChange={handleChange} 
              onFocus={() => handleFocus('address2')} onBlur={handleBlur}
              style={getInputStyle('address2')} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>City</label>
              <input 
                name="city" value={formData.city} onChange={handleChange} 
                onFocus={() => handleFocus('city')} onBlur={handleBlur}
                style={getInputStyle('city')} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>State</label>
              <input 
                name="state" value={formData.state} onChange={handleChange} 
                onFocus={() => handleFocus('state')} onBlur={handleBlur}
                style={getInputStyle('state')} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Zip</label>
              <input 
                name="zip" value={formData.zip} onChange={handleChange} 
                onFocus={() => handleFocus('zip')} onBlur={handleBlur}
                style={getInputStyle('zip')} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Contact Name</label>
            <input 
              name="contactName" value={formData.contactName} onChange={handleChange} 
              onFocus={() => handleFocus('contactName')} onBlur={handleBlur}
              style={getInputStyle('contactName')} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Phone</label>
            <input 
              name="phone" value={formData.phone} onChange={handleChange} 
              onFocus={() => handleFocus('phone')} onBlur={handleBlur}
              style={getInputStyle('phone')} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Type</label>
            <select 
              name="userType" 
              value={formData.userType} 
              onChange={handleChange} 
              onFocus={() => handleFocus('userType')} 
              onBlur={handleBlur}
              style={{
                ...getInputStyle('userType'),
                backgroundColor: 'rgba(30, 30, 30, 0.9)', 
                cursor: 'pointer'
              }}
            >
              <option value="School">School</option>
              <option value="Company">Company</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            onMouseOver={addHover} onMouseOut={removeHover}
          >
            REGISTER
          </button>

        </form>
      </div>
    </div>
  );
}

export default Signup;