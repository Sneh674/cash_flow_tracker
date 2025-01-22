import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [err,setErr]=useState("");
  
  const [formData, setFormData] = useState({
    userId: userId,
    mainCategory: "",
    subCategory: "",
    desc: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setErr("")
    setFormData((prev) => ({ ...prev, mainCategory: category }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/home/addnewcategory`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate(`/home/${userId}`)
      console.log(resp);
    } catch (error) {
      setErr(error.response.data.error.message || "Error occurred")
      console.error("Error submitting the form:", error.response.data.error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 via-gray-700 to-gray-600 text-green-400">
      <div className="backbtn pl-10 pt-10">
        <Link
          to={`/home/${userId}`}
          className="md:text-xl sm:text-base text-sm font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400"
        >
          Go Back
        </Link>
      </div>
      <div className="flex flex-col items-center py-10">
        {/* Top Buttons Section (Compact and Horizontal) */}
        <div className="flex justify-center space-x-2 sm:space-x-4 md:space-x-6 mb-4 md:mb-8">
          {["Inflow", "Outflow", "Savings"].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`text-sm sm:text-lg md:text-xl font-semibold py-1 px-2 sm:py-2 sm:px-4 md:py-3 md:px-6 bg-green-500 text-black rounded-lg shadow-md hover:bg-green-600 transition duration-300 ${
                selectedCategory === category &&
                "ring-2 sm:ring-4 ring-yellow-400 border-2 border-yellow-400 bg-yellow-400 hover:bg-yellow-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Form Section */}
        {selectedCategory && (
          <div className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 shadow-blue-300 p-4 sm:p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-sm sm:text-lg md:text-xl font-bold mb-4 text-center">
              Add Subcategory for {selectedCategory}
            </h2>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Subcategory Name */}
              <div>
                <label htmlFor="subCategory" className="block text-xs sm:text-sm mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="desc" className="block text-xs sm:text-sm mb-2">
                  Description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter description"
                ></textarea>
              </div>

              {/* Budget Input (Only for Outflow) */}
              {selectedCategory === "Outflow" && (
                <div>
                  <label htmlFor="budget" className="block text-xs sm:text-sm mb-2">
                    Budget
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter budget amount"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 text-black py-2 sm:py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300"
              >
                Add Subcategory
              </button>
            </form>
            <div className="errmsg text-red-500 font-bold text-xl">{err}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
