import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Entry = () => {
  const navigate = useNavigate();

  const verifyToken = async (token) => {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/home`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
          "Content-Type": "application/json", // Optional additional headers
        },
      });
      console.log(resp.data.userid)
      const userId=resp.data.userid;
      try {
        navigate(`/home/${userId}`)
      } catch (error) {
        console.log(error)
      }
      return resp.data.userid;
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const resp2 = verifyToken(token);
        // console.log(resp2);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        localStorage.removeItem('token')
        navigate("/");
        console.log(error)
      }
    }
  }, []);

  return (
    <div className="font-tinos flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
          Cash Flow Tracker
        </h1>
        <p className="text-lg md:text-2xl text-gray-400 max-w-xl mx-auto">
          Take control of your finances with precision and style.
        </p>
      </div>

      {/* Button Section */}
      <div className="mt-10 flex flex-col md:flex-row gap-6">
        <Link
          to="/login"
          className="flex items-center font-extrabold justify-center px-8 py-4 w-full md:w-auto text-lg bg-green-500 text-black rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition duration-300"
        >
          Log In
        </Link>
        <Link
          to="/register"
          className="flex items-center font-extrabold justify-center px-8 py-4 w-full md:w-auto text-lg bg-teal-500 text-black rounded-full shadow-md hover:bg-teal-600 hover:shadow-lg transition duration-300"
        >
          Sign Up
        </Link>
      </div>

      {/* Footer Section */}
      <footer className="mt-12 text-sm text-gray-500">
        © 2025 Cash Flow Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Entry;
