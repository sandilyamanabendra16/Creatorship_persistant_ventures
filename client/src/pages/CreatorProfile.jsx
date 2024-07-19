import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {backend_uri} from "../constants/Uri";
import styles from './CreatorProfile.module.css';

function CreatorProfile() {
  const [profiles, setProfiles] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    audience: '',
    capabilities: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${backend_uri}/creator/creator-profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.put(`${backend_uri}/creator/creator-profile/${id}`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      setProfiles(profiles.map(profile => profile._id === id ? response.data : profile));
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        await axios.delete(`${backend_uri}/creator/creator-profile/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        });
        setProfiles(profiles.filter(profile => profile._id !== id));
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };


  return (

    <div className={styles.container}>
      <h2 className={styles.title}>Creator Profiles</h2>
      {profiles.map(profile => (
        <div key={profile._id} className={styles.profileCard}>
          {isEditing === profile._id ? (
            <form onSubmit={(e) => handleSubmit(e, profile._id)} className={styles.form}>
              <input 
                className={styles.input}
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Name" 
                required 
              />
              <textarea 
                className={styles.textarea}
                name="audience" 
                value={formData.audience} 
                onChange={handleInputChange} 
                placeholder="Audience" 
                required 
              />
              <textarea 
                className={styles.textarea}
                name="capabilities" 
                value={formData.capabilities} 
                onChange={handleInputChange} 
                placeholder="Capabilities" 
                required 
              />
              <div>
                <button type="submit" className={styles.button}>Save Changes</button>
                <button type="button" onClick={() => setIsEditing(null)} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <p className={styles.profileInfo}><span className={styles.label}>Name:</span> {profile.name}</p>
              <p className={styles.profileInfo}><span className={styles.label}>Audience:</span> {profile.audience}</p>
              <p className={styles.profileInfo}><span className={styles.label}>Capabilities:</span> {profile.capabilities}</p>
              <p className={styles.profileInfo}><span className={styles.label}>Niche:</span> {profile.niche}</p>
              <button 
                onClick={() => {
                  setIsEditing(profile._id);
                  setFormData(profile);
                }} 
                className={styles.button}
              >
                Edit Profile
              </button>
              <button 
                onClick={() => handleDelete(profile._id)} 
                className={`${styles.button} ${styles.deleteButton}`}
              >
                Delete Profile
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CreatorProfile;