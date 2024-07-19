import { useEffect, useState } from "react";
import axios from "axios";
import {backend_uri} from '../constants/Uri';
import { useNavigate } from "react-router-dom";
import styles from './BusinessDashboard.module.css';

function BusinessDashboard() {
    const [name, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [offer, setOffer] = useState('');
    const [needs, setNeeds] = useState('');
    const [equityOffered, setEquityOffered] = useState('');
    const [creators, setCreators] = useState([]);
    const navigate=useNavigate();
  
    useEffect(() => {
      fetchCreators();
    }, []);
  
    const fetchCreators = async () => {
        const token = localStorage.getItem('token');
      const response = await axios.get(`${backend_uri}/creator`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
      });
      setCreators(response.data);
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          const response = await axios.post(`${backend_uri}/business`, 
            { name, description, needs, equityOffered },
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          console.log('Business creation response:', response.data);
          alert('Business profile created');
        } catch (error) {
          console.error('Error creating business profile:', error.response ? error.response.data : error.message);
          if (error.response && error.response.status === 401) {
            alert('Authentication failed. Please log in again.');
            // Redirect to login page
            navigate('/login');
          } else {
            alert('An error occurred while creating the profile');
          }
        }
      };
      const handleShareEquity = async (creatorId) => {
        const equity = prompt('Enter equity percentage to share:');
        if (equity) {
          try {
            const token = localStorage.getItem('token');
            await axios.put(`${backend_uri}/equity-request/creator/${creatorId}`, 
              { equity },
              { headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }  }
            );
            alert('Equity share request sent!');
          } catch (error) {
            console.error('Error sending equity share request:', error);
          }
        }
      };
    return (
        <div className={styles.container}>
          <h2 className={styles.title}>Creators Feed</h2>
          {creators.map(creator => (
            <div key={creator._id} className={styles.creatorCard}>
              <h3 className={styles.creatorName}>{creator.name}</h3>
              <p className={styles.creatorInfo}>
                <span className={styles.label}>Audience:</span> {creator.audience}
              </p>
              <p className={styles.creatorInfo}>
                <span className={styles.label}>Capabilities:</span> {creator.capabilities}
              </p>
              <button 
                className={styles.button}
                onClick={() => handleShareEquity(creator._id)}
              >
                Share Equity
              </button>
            </div>
          ))}
        </div>
    );
  }

  export default BusinessDashboard;