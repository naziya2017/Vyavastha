import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async () => {
    if (!agreeTerms && currState === "Sign up") {
      alert("Please agree to the terms and conditions.");
      return;
    }

    const endpoint = currState === "Sign up" ? "signup" : "login";
    const body =
      currState === "Sign up"
        ? { username, useremail: email, userpassword: password }
        : { useremail: email, userpassword: password };

    try {
      const response = await fetch(`https://vyavastha-backend.onrender.com/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setShowLogin(false);
        navigate("/");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("Logged out successfully!");
    setShowLogin(false);
    navigate("/");
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{isLoggedIn ? "Welcome!" : currState}</h2>
          <span className="close-btn" onClick={() => setShowLogin(false)}>✖</span>
        </div>

        {!isLoggedIn && (
          <div className="login-popup-inputs">
            {currState === "Sign up" && (
              <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {!isLoggedIn && (
          <>
            {currState === "Sign up" && (
              <div className="login-popup-condition">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <p>By continuing, I agree to the terms of use & privacy policy</p>
              </div>
            )}

            <button onClick={handleSubmit}>
              {currState === "Sign up" ? "Create account" : "Login"}
            </button>

            {currState === "Login" ? (
              <p>
                Create a new account?{" "}
                <span onClick={() => setCurrState("Sign up")}>Click here</span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrState("Login")}>Login here</span>
              </p>
            )}
          </>
        )}

        {isLoggedIn && (
          <div style={{ textAlign: "center" }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
