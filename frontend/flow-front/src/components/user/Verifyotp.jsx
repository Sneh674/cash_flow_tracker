import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const generatedOtp="123456"
  // const [generatedOtp, setGeneratedOtp]=useState("123456")//static otp for now
  const { id: userId } = useParams();
  const [message,setMessage]=useState("")
  // const [formData, setFormData]=useState({
  //   userId:"",
  //   otpgenerated:"",
  //   otpentered:"",
  // })

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setMessage("OTP verified successfully!");
      const resp= await axios.post(`${import.meta.env.VITE_API_URL}/verifyotp`,{userId,otpgenerated:generatedOtp,otpentered:otp})
      console.log(resp)
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="verifyOtpContainer">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="otp"
          id="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength="6"  // Assuming OTP is 6 digits
        />
        <button type="submit">Verify</button>
      </form>
      <div style={{color:"yellow"}}>{message}</div>
    </div>
  );
};

export default Verifyotp;
