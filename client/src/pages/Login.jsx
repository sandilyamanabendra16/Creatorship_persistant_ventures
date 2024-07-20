import { useState } from "react";
import axios from "axios";
import {backend_uri} from '../constants/Uri';
import bgImg from "../assets/image 466.png";
import styles from "./Login.module.css";
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
          window.location = '/business-dashboard';
        } else {
          window.location = '/creator-dashboard';
        }
      } catch (error) {
        console.error(error);
        alert(error.response.data.message);
      }
    };
  
    return (
        <div className={styles.full}>
        <div className={styles.left}>
        <h1> Already have an account? </h1>
        <h3>Explore more of our Services </h3>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p> Don't have an account <a href="/register">Sign Up</a></p>
      </div>
      <div className={styles.right}>
            <h1>Your Personal Creatorship Partner</h1>
            <img src={bgImg} alt="bgImg"/>
        </div>
      </div>
    );
  }

  export default Login;