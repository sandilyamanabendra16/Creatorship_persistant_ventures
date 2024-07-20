import React, { useState, useEffect, useRef } from 'react';
import "./HomePage.css";
import img1 from "../assets/lady.png";
import img2 from "../assets/image1.png";
import img3 from "../assets/image2.png";
import img4 from "../assets/image3.jpg";
import img5 from "../assets/image4.JPG";
import img6 from "../assets/Better_strategy.png";
import img7 from "../assets/target.png";
import img8 from "../assets/peform.png";
import img9 from "../assets/security.png";
import img10 from "../assets/strategy.png";
import img11 from "../assets/footer.png";
import { projects } from '../constants/project';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeDiv, setActiveDiv] = useState(null);
  const formContainerRef = useRef(null);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Check local storage for user type when the app loads
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formContainerRef.current && !formContainerRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContactClick = () => {
    setShowPopup(true);
  };

  const handleNavButtonClick = (index) => {
    setCurrentSlide(index);
  };

  const handleDivClick = (divId) => {
    setActiveDiv(divId);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <div className="container">
        <div className="first">
            <section className="intro">
                <h2 className="award">REVOLUTIONARY</h2>
                <h1 className="title">CREATOR-BUSINESS PARTNERSHIPS</h1>
                <p className="description">
                Creatorships is a groundbreaking platform connecting creators with large audiences to early-stage companies. We facilitate equity-based partnerships, allowing businesses to offer ownership stakes in exchange for creator collaborations.
                </p>
                <button className="contact-button" onClick={handleContactClick}>CONTACT US</button>
            </section>
            <section>
                <img src={img1}/>
            </section>
        </div>


      
    {showPopup && (
      <div className="popup-form">
        <div className="form-container">
          <h2>Talk to us</h2>
          <form action="https://getform.io/f/anleqzja" method="POST">
            <div className="inputs">
              <label htmlFor="email">Work email</label>
              <input type="email" placeholder="Work email*" name="workemail" id="email" required />
            </div>
            
            <div className="fnln">
              <div className="inputs">
                <label htmlFor="firstname">First name</label>
                <input type="text" placeholder="First name*" name="firstname" id="firstname" required />
              </div>
              <div className="inputs">
                <label htmlFor="lastname">Last name</label>
                <input type="text" placeholder="Last name*" name="lastname" id="lastname" required />
              </div>
            </div>
            
            <label>
              <input type="checkbox" required /> I agree to the terms and conditions, and provide consent to send me communication.
            </label>
            <button className="submit-button" type="submit">Contact Us</button>
            <button className="close-button" onClick={handleClosePopup}>Close</button>
          </form>
        </div>
      </div>
    )}

<div className="container1">
        <h1>WHAT WE OFFER</h1>
        <div class="cont1">
            <h2>SERVICES PROVIDE BY CREATORSHIP</h2>
            <div>
                <p>Our platform revolutionizes creator-business relationships by facilitating equity-based partnerships. We connect influential creators with promising startups, fostering mutually beneficial collaborations.</p>

            </div>
        </div>
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${currentSlide * 25}%)` }}>
        <div className="slide">
                    <img src={img2} alt="Service 1"/>
                    <div className="slide-content">
                        <h3>EQUITY PARTNERSHIPS</h3>
                       <p>Facilitate equity-based deals between creators and businesses, aligning long-term interests.</p>
                        <a href={userType ? (userType === 'creator'? "/creator-dashboard": "/business-dashboard"):"/login"} target="_blank" class="read-more">LEARN MORE →</a>
                    </div>
                </div>
                <div className="slide">
                    <img src={img3} alt="Service 2"/>
                    <div className="slide-content">
                        <h3>STARTUP PROMOTION</h3>
                        <p>Connect early-stage companies with influential creators to boost growth and visibility.</p>
                        <a href={userType ? (userType === 'creator'? "/creator-dashboard": "/business-dashboard"):"/login"} target="_blank" class="read-more">DISCOVER →</a>
                    </div>
                </div>
                <div className="slide">
                    <img src={img4} alt="Service 3"/>
                    <div className="slide-content">
                        <h3>WEB DEVELOPMENT</h3>
                        <p>Morbi sed lacus nec risus finibus feugiat et fermentum nibh. Pellentesque</p>
                        <a href={userType ? (userType === 'creator'? "/creator-dashboard": "/business-dashboard"):"/login"} target="_blank" class="read-more">EXPLORE →</a>
                    </div>
                </div>
                <div className="slide">
                    <img src={img5} alt="Service 4"/>
                    <div className="slide-content">
                        <h3>PORTFOLIO DEVELOPMENT</h3>
                        <p>Help creators and our platform build valuable portfolios of equity stakes.</p>
                        <a href={userType ? (userType === 'creator'? "/creator-dashboard": "/business-dashboard"):"/login"} target="_blank" class="read-more">READ MORE →</a>
                    </div>
                </div>
        </div>
        <div className="nav-buttons">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`nav-button ${currentSlide === index ? 'active' : ''}`}
              onClick={() => handleNavButtonClick(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
    <section className="container2">
        <h3>WHY CHOOSE US</h3>
        <h1> WHY WE ARE BEST</h1>
        <div className="best">
            <div class="best1">
                <img src={img7}/>
                <h4>Targeted Partnerships</h4>
                <p>
                We connect creators with businesses that align with their audience and values, ensuring meaningful collaborations.
                </p>
            </div>
            <div className="best1">
                <img src={img8} />
                <h4>Long-Term Value</h4>
                <p>
                Our equity-based model allows creators to benefit from a company's long-term success, not just short-term promotions.
                </p>
            </div>
            <div className="best1">
                <img src={img9}/>
                <h4>Secure Transactions</h4>
                <p>
                We ensure all equity deals are properly structured and legally sound, protecting both creators and businesses.

                </p>
            </div>
            <div className="best1">
                <img src={img10} />
                <h4>Strategic Growth</h4>
                <p>
                Our partnerships are designed to drive strategic growth for businesses while leveraging creators' influence.

                </p>
            </div>
        </div>
    </section>
    <section className="container3">
      <h4>OUR PROJECT</h4>
      <h1>WHY WE ARE THE BEST</h1>
      <div className="contain3">
        {projects.map((project) => (
          <img 
            key={project.id}
            src={project.image} 
            className={`cont_img ${project.id === 'contdiv2' ? '' : project.id}`}
            style={{ display: activeDiv === project.id ? 'block' : 'none' }}
            alt={project.title}
          />
        ))}
        <div className="subcont">
          {projects.map((project) => (
            <div
              key={project.id}
              className="cont_div"
              id={project.id}
              onClick={() => handleDivClick(project.id)}
              style={{ backgroundColor: activeDiv === project.id ? '#FF3147' : '' }}
            >
              <h5>{project.title}</h5>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section class="company-growth">
            <h4> EXPERT GROWTS</h4>
            <h2>OUR COMPANY GROWTH</h2>
            <div class="stats">
                <div class="stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FF3147" class="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                      </svg>
                    <p class="number">500+</p>
                    <p class="label">Creators Onboarded</p>
                </div>
                <div class="stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FF3147" class="bi bi-clock-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      </svg>
                    <p class="number">200+</p>
                    <p class="label">Businesses Partnered</p>
                </div>
                <div class="stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FF3147" class="bi bi-check2-circle" viewBox="0 0 16 16">
                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                      </svg>
                    <p class="number">$50M+</p>
                    <p class="label">Equity Value Facilitated</p>
                </div>
                <div class="stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FF3147" class="bi bi-trophy-fill" viewBox="0 0 16 16">
                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
                      </svg>
                    <p class="number">35+</p>
                    <p class="label">Success Stories</p>
                </div>
            </div>
        </section>
        <section class="client-feedback">
        <h5>PARTNER TESTIMONIALS</h5>
          <h1 class="feedback">WHAT OUR PARTNERS SAY</h1>
          <blockquote>
             <p>"Creatorships revolutionized our growth strategy. By partnering us with the perfect creator, we saw our user base triple in just two months. The equity deal structure aligned our long-term goals perfectly. It's not just a platform, it's a game-changer for startups like us."</p>
            <p><b>SARAH JOHNSON</b> - CEO, TECHNOVATE SOLUTIONS</p>
          </blockquote>
          <blockquote>
            <p>"As a creator, I've always been cautious about brand deals. Creatorships changed that by offering me a stake in the companies I promote. Now, I'm not just an influencer, I'm a partner in their success. It's incredibly motivating and has transformed my approach to collaborations."</p>
             <p><b>ALEX RIVERA</b> - TECH & LIFESTYLE CONTENT CREATOR</p>
          </blockquote>
        </section>
        <footer>
            <img src={img11}/>
        </footer>
    </div>
  );
}

export default HomePage;