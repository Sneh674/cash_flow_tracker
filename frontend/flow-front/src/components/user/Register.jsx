import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cc: "91",
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
  const [mesasge, setMessage] = useState("");
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        formData
      );
      // console.log(resp);
      // console.log(resp.data.user._id)
      const userId=resp.data.user._id;
      navigate(`/verifyotp/${userId}`);
    } catch (error) {
      console.error(
        "Error during Registration:",
        error.response?.data.error.message || error.message
      );
      setMessage(error.response?.data.error.message || error.message);
    }
  };
  return (
    <div className="registerMain font-tinos bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-500">
      <div>
        <Link to="/" className="go-back-link">
          Go Back
        </Link>
      </div>
      <div>Register User</div>
      <form onSubmit={handleRegisterSubmit}>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <select name="cc" value={formData.cc} onChange={handleChange}>
          <option value="91">+91 (India)</option>
          <option value="1">+1 (USA)</option>
          <option value="44">+44 (UK)</option>
          <option value="61">+61 (Australia)</option>
        </select>
        <input
          type="tel"
          name="mobile"
          id="mobile"
          placeholder="Your mobile number"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Your email"
          onChange={handleChange}
        />
        <input type="submit" value="Submit" />
      </form>
      <div style={{ color: "orange" }}>{mesasge}</div>
    </div>
  );
};

export default Register;
