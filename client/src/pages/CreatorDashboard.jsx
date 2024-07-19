import { useEffect, useState } from "react";
import axios from "axios";
import {backend_uri} from '../constants/Uri';
import { useNavigate } from "react-router-dom";
import styles from './CreatorDashboard.module.css';

function CreatorDashboard() {
    const [name, setName] = useState('');
    const [audience, setAudience] = useState('');
    const [capabilities, setCapabilities] = useState('');
    const [businesses, setBusinesses] = useState([]);
    const[niche, setNiche]=useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchBusinesses();
    }, []);
  
    const fetchBusinesses = async () => {
        const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
      const response = await axios.get(`${backend_uri}/business`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
      });
      setBusinesses(response.data);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
        await axios.post(`${backend_uri}/creator`, 
          { name, audience, capabilities, niche },
          { headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } }
        );
        alert('Creator profile created');
      } catch (error) {
        console.error(error);
      }
    };
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/login'); // Redirect to login page
    };
    
    const handleRequestEquity = async (businessId) => {
        const equity = prompt('Enter equity percentage to request:');
        if (equity) {
          try {
            const token = localStorage.getItem('token');
            await axios.put(
              `${backend_uri}/equity-request/requests/${businessId}`,
              { equity },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            alert('Equity request sent!');
          } catch (error) {
            console.error('Error sending equity request:', error);
            if (error.response) {
              alert(`Error: ${error.response.data.message}`);
            } else {
              alert('An error occurred while sending the request.');
            }
          }
        }
      };
    return (
        <div className={styles.container}>
          <h2 className={styles.title}>Businesses Feed</h2>
          {businesses.map(business => (
            <div key={business._id} className={styles.businessCard}>
              <h3 className={styles.businessName}>{business.name}</h3>
              <p className={styles.businessInfo}>
                <span className={styles.label}>Description:</span> {business.description}
              </p>
              <p className={styles.businessInfo}>
                <span className={styles.label}>Offer:</span> {business.offer}
              </p>
              <p className={styles.businessInfo}>
                <span className={styles.label}>Needs:</span> {business.needs}
              </p>
              <p className={styles.businessInfo}>
                <span className={styles.label}>Equity Offered:</span> {business.equityOffered}%
              </p>
              <button 
                className={styles.button} 
                onClick={() => handleRequestEquity(business._id)}
              >
                Request Equity
              </button>
            </div>
          ))}
        </div>
    );
  }
  
  export default CreatorDashboard;