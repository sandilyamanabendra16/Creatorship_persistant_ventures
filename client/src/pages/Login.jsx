import { useState } from "react";
import axios from "axios";
import {backend_uri} from '../constants/Uri';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${backend_uri}/auth/login`, { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        if (response.data.userType === 'business') {
          window.location = '/home';
        } else {
          window.location = '/home';
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    );
  }

  export default Login;