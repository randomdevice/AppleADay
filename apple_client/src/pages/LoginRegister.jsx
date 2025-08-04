import React, { useState } from "react";
import "../styles/LoginRegister.css"; // Assuming you have a CSS file for styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons'



const LoginRegister = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = e => {
    e.preventDefault();
    console.log("Sign Up:", formData);
    // Save to localStorage or send to Node.js API
    localStorage.setItem("user", JSON.stringify(formData));
  };

  const handleSignIn = e => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email === formData.email && user?.password === formData.password) {
      alert("Login success!");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{justifyContent: "center", alignItems: "center", display: "flex", height: "70vh", bottom: "100vh"}}>
      <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faGoogle} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" name="name" onChange={handleChange} />
            <input type="text" placeholder="Email" name="email" onChange={handleChange} />
            <input type="text" placeholder="Password" name="password" onChange={handleChange} />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faGoogle} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
            <span>or use your account</span>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="text" placeholder="Password" name="password" onChange={handleChange} />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="main-header">Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setIsSignUpActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="main-header">Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => setIsSignUpActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;

