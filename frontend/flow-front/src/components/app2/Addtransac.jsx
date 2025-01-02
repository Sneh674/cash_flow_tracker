import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Addtransac = () => {
  const { id: userId, mainc: mainCategory, subc: subCategory } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mainCategory,
    subCategory,
    amount: null,
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/home/addnewtransaction`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(resp);
      navigate(`/home/${userId}/selectedsubcat/${mainCategory}/${subCategory}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-green-400">
      <div className="backbtn pl-5 pt-5">
        <button
          onClick={() =>
            navigate(
              `/home/${userId}/selectedsubcat/${mainCategory}/${subCategory}`
            )
          }
          className="w-max md:text-xl sm:text-base text-sm font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400"
        >
          Go Back
        </button>
      </div>
      <div className="flex flex-col items-center pt-10">
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Add New Transaction
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-11/12 max-w-md bg-gray-800 p-6 rounded-md shadow-lg"
        >
          <div>
            <label
              htmlFor="amount"
              className="block text-sm mb-2 font-semibold"
            >
              Transaction Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              required
              onChange={handleChange}
              placeholder="Enter transaction amount"
              className="w-full p-3 rounded-md bg-gray-900 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm mb-2 font-semibold">
              Note
            </label>
            <input
              type="text"
              name="note"
              id="note"
              onChange={handleChange}
              placeholder="Enter note"
              className="w-full p-3 rounded-md bg-gray-900 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addtransac;
