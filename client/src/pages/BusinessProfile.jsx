import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backend_uri } from '../constants/Uri';
import styles from './BusinessProfile.module.css';

function BusinessProfile() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${backend_uri}/business/user-profiles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProfiles(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setError('Failed to fetch profiles. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setProfiles(profiles.map(profile => 
      profile._id === id ? { ...profile, [name]: value } : profile
    ));
  };

  const handleSubmit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const profileToUpdate = profiles.find(profile => profile._id === id);
      const response = await axios.put(`${backend_uri}/business/business-profile/${id}`, profileToUpdate, { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      setProfiles(profiles.map(profile => 
        profile._id === id ? response.data : profile
      ));
      setEditingId(null);
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
        await axios.delete(`${backend_uri}/business/business-profile/${id}`, {
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
console.log(profiles);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (

    <div className={styles.container}>
      <h2 className={styles.title}>Business Profiles</h2>
      {profiles.length === 0 ? (
        <p className={styles.noProfiles}>No business profiles found.</p>
      ) : (
        profiles.map(profile => (
          <div key={profile._id} className={styles.profileCard}>
            {editingId === profile._id ? (
              <>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(profile._id); }} className={styles.form}>
                  <input 
                    className={styles.input}
                    name="name" 
                    value={profile.name} 
                    onChange={(e) => handleInputChange(e, profile._id)} 
                    placeholder="Company Name" 
                    required 
                  />
                  <textarea 
                    className={styles.textarea}
                    name="description" 
                    value={profile.description} 
                    onChange={(e) => handleInputChange(e, profile._id)} 
                    placeholder="Description" 
                    required 
                  />
                  <textarea 
                    className={styles.textarea}
                    name="needs" 
                    value={profile.needs} 
                    onChange={(e) => handleInputChange(e, profile._id)} 
                    placeholder="Needs" 
                    required 
                  />
                  <input 
                    className={styles.input}
                    type="number" 
                    name="equityOffered" 
                    value={profile.equityOffered} 
                    onChange={(e) => handleInputChange(e, profile._id)} 
                    placeholder="Equity Offered (%)" 
                    required 
                  />
                </form>
                <div className={styles.buttonContainer}>
                  <button onClick={() => handleSubmit(profile._id)} className={`${styles.button} ${styles.saveButton}`}>Save Changes</button>
                  <button onClick={() => setEditingId(null)} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className={styles.profileName}>{profile.name}</h3>
                <p className={styles.profileInfo}><span className={styles.label}>Description:</span> {profile.description}</p>
                <p className={styles.profileInfo}><span className={styles.label}>Needs:</span> {profile.needs}</p>
                <p className={styles.profileInfo}><span className={styles.label}>Equity Offered:</span> {profile.equityOffered}%</p>
                <div className={styles.buttonContainer}>
                  <button onClick={() => setEditingId(profile._id)} className={`${styles.button} ${styles.editButton}`}>Edit Profile</button>
                  <button onClick={() => handleDelete(profile._id)} className={`${styles.button} ${styles.deleteButton}`}>Delete Profile</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default BusinessProfile;