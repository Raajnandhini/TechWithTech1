import React, { useState, useEffect } from 'react';
import { createRequest, findMatchingDonations, executeMatch } from '../api';
import { useNavigate } from 'react-router-dom';

function CreateRequest() {
  const [itemName, setItemName] = useState('Computers');
  const [quantity, setQuantity] = useState('');
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await findMatchingDonations(itemName);
        setMatches(response.data);
      } catch (error) { 
        console.error("No matches found"); 
        setMatches([]);
      }
    }
    loadMatches();
  }, [itemName]);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRequest({ 
        user_id: user.party_id, 
        item_name: itemName, 
        quantity: parseInt(quantity) 
      });
      alert('Request Created Successfully');
      navigate('/school-dashboard');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Failed'));
    }
  };

  const handleAccept = async (donation) => {
    const companyName = donation.donor?.PTY_Name || "the Donor";
    const maxAvailable = donation.ITD_PendingQuantity; 

    const amount = prompt(`How many ${itemName} do you want from ${companyName}? (Available: ${maxAvailable})`, Math.min(maxAvailable, 10));
    
    if (!amount) return; 
    const qtyInt = parseInt(amount);

    if (isNaN(qtyInt) || qtyInt <= 0) {
        alert("Please enter a valid number greater than 0.");
        return;
    }

    if (qtyInt > maxAvailable) {
        alert(`Error: You cannot accept ${qtyInt} items. Only ${maxAvailable} are available.`);
        return; 
    }

    try {
      const reqRes = await createRequest({
        user_id: user.party_id,
        item_name: itemName,
        quantity: qtyInt
      });
      const newRequestId = reqRes.data.ITR_ID;

      await executeMatch({
        request_id: newRequestId,
        donation_id: donation.ITD_ID,
        quantity: qtyInt
      });
      
      alert("Accepted Successfully!");
      navigate('/school-dashboard');
    } catch (err) { 
      alert("Error accepting donation: " + (err.response?.data?.detail || err.message)); 
    }
  };

  const internalStyles = `
    .dashboard-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 0.95rem;
      border: 2px solid #555; 
    }
    
    .dashboard-table thead tr {
      background-color: #2c3e50; 
      color: #ecf0f1;
      text-align: left;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .dashboard-table th, 
    .dashboard-table td {
      padding: 15px;
      border: 1px solid #7f8c8d; 
    }

    .dashboard-table tbody tr {
      background-color: #bdc3c7; 
      color: #2c3e50;
      transition: background-color 0.2s ease;
    }

    .dashboard-table tbody tr:hover {
      background-color: #aab7b8; 
    }

    .form-control {
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    .btn-submit {
      background-color: #007bff; 
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s;
    }
    .btn-submit:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .btn-action {
      background-color: #27ae60; 
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      border: 1px solid #1e8449;
    }
    .btn-action:hover {
      background-color: #219150;
    }
  `;

  const pageContainerStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1a1a1a', 
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '80px',
    paddingBottom: '40px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const contentCardStyle = {
    backgroundColor: '#34495e', 
    color: '#ecf0f1',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    width: '90%',
    maxWidth: '1000px',
    border: '1px solid #4a6278'
  };

  const sectionBoxStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    padding: '25px',
    borderRadius: '8px',
    border: '1px solid #555',
    marginBottom: '30px'
  };

  return (
    <div style={pageContainerStyle}>
      <style>{internalStyles}</style>

      <div style={contentCardStyle}>
        <h2 style={{ marginTop: 0, textTransform: 'uppercase', borderBottom: '2px solid #555', paddingBottom: '15px' }}>
          Create New Request
        </h2>
        
        <div style={sectionBoxStyle}>
          <h3 style={{ marginTop: 0, color: '#ecf0f1' }}>Option 1: Request an Item</h3>
          <p style={{ color: '#bdc3c7', marginBottom: '15px' }}>
            Post a request so companies can see what your school needs.
          </p>
          
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <select 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
              className="form-control"
              style={{ flex: 1, minWidth: '200px' }}
            >
              <option value="Computers">Computers</option>
              <option value="Laptops">Laptops</option>
              <option value="Projectors">Projectors</option>
              <option value="Books">Books</option>
            </select>
            
            <input 
              type="number" 
              placeholder="Qty" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              className="form-control"
              style={{ width: '100px' }}
            />
            
            <button type="submit" className="btn-submit">
              Submit Request
            </button>
          </form>
        </div>

        <h3 style={{ color: '#ecf0f1', borderLeft: '5px solid #27ae60', paddingLeft: '10px' }}>
          Option 2: Available Donations for {itemName}
        </h3>
        
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Available Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.ITD_ID}>
                <td style={{ fontWeight: 'bold' }}>{m.donor?.PTY_Name || 'Unknown Company'}</td>
                
                <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                  {m.ITD_PendingQuantity}
                </td>
                
                <td>
                  <button 
                    onClick={() => handleAccept(m)} 
                    className="btn-action"
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#555' }}>
                  No donations found for {itemName}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CreateRequest;