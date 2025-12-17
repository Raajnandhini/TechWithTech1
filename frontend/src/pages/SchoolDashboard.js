import React, { useEffect, useState } from 'react';
import { getRequests } from '../api';
import { useNavigate } from 'react-router-dom';

function SchoolDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.party_id) {
      getRequests(user.party_id)
        .then(res => setRequests(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

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

    .btn-create {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      font-weight: bold;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-create:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
    }

    .status-badge {
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
      border: 1px solid rgba(0,0,0,0.1);
    }
    .status-fulfilled {
      background-color: #28a745;
      color: white;
    }
    .status-pending {
      background-color: #e67e22; 
      color: white;
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
    maxWidth: '1200px',
    position: 'relative',
    border: '1px solid #4a6278'
  };

  const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '2px solid #555',
    paddingBottom: '20px'
  };

  return (
    <div style={pageContainerStyle}>
      <style>{internalStyles}</style>

      <div style={contentCardStyle}>
        
        <div style={headerRowStyle}>
          <div>
            <h2 style={{ margin: 0, color: '#ecf0f1', fontSize: '2rem', textTransform: 'uppercase' }}>School Dashboard</h2>
            <h3 style={{ margin: '5px 0 0 0', color: '#bdc3c7', fontWeight: '400' }}>
              Welcome back, <strong>{user?.name}</strong>
            </h3>
          </div>
          
          <button onClick={() => navigate('/create-request')} className="btn-create">
            <span>+</span> Create New Request
          </button>
        </div>

        <h3 style={{ color: '#ecf0f1', borderLeft: '5px solid #007bff', paddingLeft: '10px', marginTop: '0' }}>
          Your past Request History
        </h3>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Received From (Company)</th> {/* NEW COLUMN */}
              <th>Total Needed</th>
              <th>Received</th>
              <th>Still Pending</th>
              <th>Date Requested</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const received = req.ITR_Quantity - req.ITR_PendingQuantity;
              const isFulfilled = req.ITR_PendingQuantity === 0;

              return (
                <tr key={req.ITR_ID}>
                  <td style={{ fontWeight: 'bold' }}>{req.ITR_ItemName}</td>
                  
                  {/* NEW COLUMN DATA */}
                  <td style={{ color: '#2c3e50', fontStyle: 'italic', fontWeight: 'bold' }}>
                    {req.match_name || '-'}
                  </td>

                  <td style={{ fontWeight: 'bold' }}>{req.ITR_Quantity}</td>
                  <td style={{ color: '#0056b3', fontWeight: 'bold' }}>{received}</td>

                  <td style={{ fontWeight: 'bold' }}>
                    {req.ITR_PendingQuantity > 0 ? (
                      <span style={{ color: '#c0392b' }}>{req.ITR_PendingQuantity}</span>
                    ) : (
                      <span style={{ color: '#555' }}>0</span>
                    )}
                  </td>
                  
                  <td>{new Date(req.ITR_CreateDate).toLocaleDateString()}</td>
                  
                  <td>
                    {isFulfilled 
                      ? <span className="status-badge status-fulfilled">✓ Fulfilled</span> 
                      : <span className="status-badge status-pending">Pending</span>}
                  </td>
                </tr>
              );
            })}
            
            {requests.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SchoolDashboard;