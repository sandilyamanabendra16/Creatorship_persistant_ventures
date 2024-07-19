import axios from "axios";
import { useState } from "react";
import {backend_uri} from '../constants/Uri';
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [name, setName] = useState(''); 
    const navigate= useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${backend_uri}/auth/register`, { name, email, password, userType });
        alert('Registered successfully');
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
        />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
          <option value="">Select user type</option>
          <option value="business">Business</option>
          <option value="creator">Creator</option>
        </select>
        <button type="submit">Register</button>
      </form>
    );
  }
  
  export default Register;