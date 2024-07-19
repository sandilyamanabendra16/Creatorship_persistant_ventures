import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backend_uri } from '../constants/Uri';
import styles from './CreatorForm.module.css';

const CreatorForm = () => {
    const [name, setName] = useState('');
    const [audience, setAudience] = useState('');
    const [capabilities, setCapabilities] = useState('');
    const[niche, setNiche]=useState('');
    const navigate = useNavigate();
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
          navigate('/creator-dashboard');
        } catch (error) {
          console.error(error);
        }
      };
  return (
<div className={styles.container}>
  <h2 className={styles.title}>Create Creator Profile</h2>
  <form onSubmit={handleSubmit} className={styles.form}>
    <input
      className={styles.input}
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
      required
    />
    <textarea
      className={styles.textarea}
      value={audience}
      onChange={(e) => setAudience(e.target.value)}
      placeholder="Audience"
      required
    />
    <textarea
      className={styles.textarea}
      value={capabilities}
      onChange={(e) => setCapabilities(e.target.value)}
      placeholder="Capabilities"
      required
    />
    <input
      className={styles.input}
      value={niche}
      onChange={(e) => setNiche(e.target.value)}
      placeholder="Niche"
      required
    />
    <button className={styles.button} type="submit">Create Profile</button>
  </form>
</div>
  )
}

export default CreatorForm