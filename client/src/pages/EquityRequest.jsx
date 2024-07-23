import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backend_uri } from '../constants/Uri';
import styles from './EquityRequest.module.css';

function EquityRequests() {
  const [requests, setRequests] = useState([]);
  const [userType, setUserType] = useState('');
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backend_uri}/equity-request`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }  
      });
      setRequests(response.data);
      console.log(response);

      // Fetch user type
      const userResponse = await axios.get(`${backend_uri}/auth/user`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }  
      });

      setUserType(userResponse.data.userType);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };


const handleStatusUpdate = async (businessId, requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${backend_uri}/equity-request/${businessId}`,
        { requestId, status },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }  
        }
      );
      
      // Update the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status: status } : req
        )
      );
      
      alert(`Request ${status} successfully`);
    } catch (error) {
      console.error('Error updating request:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while updating the request');
      }
    }
  };
  const handleStatusUpdateforBusiness = async (creatorId, requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${backend_uri}/equity-request/creator/request/${creatorId}`,
        { requestId, status },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }  
        }
      );
      
      // Update the local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status: status } : req
        )
      );
      
      alert(`Request ${status} successfully`);
    } catch (error) {
      console.error('Error updating request:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while updating the request');
      }
    }
  };
console.log(requests);
const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
});

  return (
<div className={styles.container}>
  <h2 className={styles.title}>Equity Requests</h2>
  <select 
    className={styles.filter}
    value={filter} 
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="all">All Requests</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>
  {filteredRequests.map(request => (
    <div key={request._id} className={styles.requestCard}>
      {userType === 'business' ? (
        <div>
          <p className={styles.requestInfo}><span className={styles.label}>From Creator ID:</span> {request.creatorId}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Service Provider Name:</span> {request.businessName}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Creator Name:</span> {request.creatorName}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Creator Email:</span> {request.creatorEmail}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Equity:</span> {request.equity}%</p>
          <p className={styles.requestInfo}>
            <span className={styles.label}>Status:</span> 
            <span className={`${styles.status} ${styles[`status${request.status.charAt(0).toUpperCase() + request.status.slice(1)}`]}`}>
              {request.status}
            </span>
          </p>
          {request.status === 'pending' && (
            <div className={styles.buttonContainer}>
              <button 
                onClick={() => handleStatusUpdate(request.businessId, request._id, 'approved')}
                className={`${styles.button} ${styles.approveButton}`}
              >
                Approve
              </button>
              <button 
                onClick={() => handleStatusUpdate(request.businessId, request._id, 'rejected')}
                className={`${styles.button} ${styles.rejectButton}`}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className={styles.requestInfo}><span className={styles.label}>From Business ID:</span> {request.businessId}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Business Name:</span> {request.businessName}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Creator Name:</span> {request.creatorName}</p>
          <p className={styles.requestInfo}><span className={styles.label}>Equity:</span> {request.equity}%</p>
          <p className={styles.requestInfo}>
            <span className={styles.label}>Status:</span> 
            <span className={`${styles.status} ${styles[`status${request.status.charAt(0).toUpperCase() + request.status.slice(1)}`]}`}>
              {request.status}
            </span>
          </p>
          {request.status === 'pending' && (
            <div className={styles.buttonContainer}>
              <button 
                onClick={() => handleStatusUpdateforBusiness(request.creatorId, request._id, 'approved')}
                className={`${styles.button} ${styles.approveButton}`}
              >
                Approve
              </button>
              <button 
                onClick={() => handleStatusUpdateforBusiness(request.creatorId, request._id, 'rejected')}
                className={`${styles.button} ${styles.rejectButton}`}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  ))}
</div>
  );
}

export default EquityRequests;