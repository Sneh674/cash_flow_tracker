// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [mesasge, setMessage] = useState("");
  const [formData, setFormData] = useState({
    cc: "+91",
    mobile: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    try {
        const resp= await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData)
        console.log(resp)
        navigate("/verifyotp")
    } catch (error) {
        console.error('Error during Login:', error.response?.data.error.message || error.message);
        setMessage(error.response?.data.error.message || error.message)
        // alert('Login failed!');
    }
  };
  const [usingMobile, setUsingMobile] = useState(true);
  return (
    <div>
      <div>
        <Link to="/">Go Back</Link>
      </div>
      <div className="loginMain">
        {usingMobile ? (
          <div className="usemobile">
            <form onSubmit={handleLoginSubmit}>
              <select name="cc" id="cc" value={formData.cc} onChange={handleChange}>
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (Australia)</option>
              </select>
              <input
                type="tel"
                name="mobile"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="mobile"
              />
              <input type="submit" value="Submit" />
            </form>
            <button onClick={() => {
                    setUsingMobile(false)
                    setFormData((prevData) => ({
                        ...prevData,
                        mobile: "",
                      }));
                    }
                }>
              Login using email
            </button>
          </div>
        ) : (
          <div className="useemail">
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email"
              />
              <input type="submit" value="Submit" />
            </form>
            <button onClick={() => {
                    setUsingMobile(true)
                    setFormData((prevData) => ({
                        ...prevData,
                        email: "",
                      }));
                }}>
              Login using mobile number
            </button>
          </div>
        )}
        <div style={{color:"red"}}>{mesasge}</div>
      </div>
    </div>
  );
};

export default Login;
