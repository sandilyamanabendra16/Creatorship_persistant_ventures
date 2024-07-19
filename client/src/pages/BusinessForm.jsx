import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backend_uri } from '../constants/Uri';
import styles from "./BusinessForm.module.css";

const BusinessForm = () => {
    const [name, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [needs, setNeeds] = useState('');
    const [equityOffered, setEquityOffered] = useState('');
   
    const navigate=useNavigate();

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
          navigate('/business-dashboard');
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

  return (
    <div className={styles.container}>
  <h2 className={styles.title}>Create Business Profile</h2>
  <form onSubmit={handleSubmit} className={styles.form}>
    <input
      className={styles.input}
      value={name}
      onChange={(e) => setCompanyName(e.target.value)}
      placeholder="Company Name"
      required
    />
    <textarea
      className={styles.textarea}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description"
      required
    />
    <textarea
      className={styles.textarea}
      value={needs}
      onChange={(e) => setNeeds(e.target.value)}
      placeholder="Needs"
      required
    />
    <input
      className={styles.input}
      type="number"
      value={equityOffered}
      onChange={(e) => setEquityOffered(e.target.value)}
      placeholder="Equity Offered (%)"
      required
    />
    <button className={styles.button} type="submit">Create Profile</button>
  </form>
</div>
  )
}

export default BusinessForm