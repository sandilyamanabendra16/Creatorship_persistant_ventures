import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import BusinessDashboard from './pages/BusinessDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import HomePage from './pages/HomePage';
import BusinessProfile from './pages/BusinessProfile';
import CreatorProfile from './pages/CreatorProfile';
import EquityRequests from './pages/EquityRequest';
import CreatorForm from './pages/CreatorForm';
import BusinessForm from './pages/BusinessForm';
import "./App.css";
function App() {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for user type when the app loads
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  // const handleLogin = (type) => {
  //   setUserType(type);
  //   localStorage.setItem('userType', type);
  // };

  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
    <nav className="navbar">
  <div className="nav-container">
    <ul className="nav-list left">
      <li className="nav-item"><Link to="/home" className="nav-link">Home</Link></li>
    </ul>
    <ul className="nav-list center">
      {userType && (
        <>
          {userType === 'creator' ? 
            <li className="nav-item"><Link to="/creator-form" className="nav-link">Creator Form</Link></li> :
            <li className="nav-item"><Link to="/business-form" className="nav-link">Business Form</Link></li>
          }
          <li className="nav-item">
            <Link to={userType === 'creator' ? '/creator-profile' : '/business-profile'} className="nav-link">
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to={userType === 'creator' ? "/creator-dashboard" : "/business-dashboard"} className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="equity-requests/" className="nav-link">EquityRequest</Link>
          </li>
        </>
      )}
    </ul>
    <ul className="nav-list right">
      {!userType ? (
        <>
          <li className="nav-item"><Link to="/register" className="nav-link">Register</Link></li>
          <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
        </>
      ) : (
        <li className="nav-item">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      )}
    </ul>
  </div>
</nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/creator-profile" element={<CreatorProfile />} />
        <Route path="/equity-requests" element={<EquityRequests/>} />
        <Route path="/creator-form" element={<CreatorForm/>}/>
        <Route path="/business-form" element={<BusinessForm/>}/>
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;