import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Verifyotp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const generatedOtp = "123456"; // Static OTP for now
  const { id: userId } = useParams();
  const [message, setMessage] = useState("");

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      setMessage("OTP verified successfully! \n Please wait, loading...");
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/verifyotp`,
        { userId, otpgenerated: generatedOtp, otpentered: otp }
      );
      console.log(resp.data.token);
      const token = resp.data.token;
      localStorage.setItem("token", token);
      window.history.pushState(null, "", window.location.href);
      navigate(`/home/${userId}`);
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <div className="md:text-lg font-tinos font-bold text-green-300 md:px-10 md:py-10 px-4 py-4">
        <Link
          to="/"
          className="hover:text-black hover:bg-green-300 p-4 rounded-md"
        >
          Go Back
        </Link>
      </div>
      <div className="flex flex-col items-center  min-h-screen bg-black text-white px-6 md:py-10 py-5">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
            Verify OTP
          </h2>
          {/* <p className="text-gray-400 text-lg md:text-xl">
      Please enter the OTP sent to your registered email.
    </p> */}
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full max-w-md flex flex-col gap-6"
        >
          <input
            type="text"
            name="otp"
            id="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
            maxLength="6"
            className="w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-max md:px-6 md:py-3 px-4 py-2 md:text-2xl text-base font-bold mx-auto bg-green-500 text-black rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transition duration-300"
          >
            Verify OTP
          </button>
        </form>
        <div
          className={`mt-4 text-lg font-semibold ${
            message === "OTP verified successfully! \n Please wait, loading..."
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default Verifyotp;
