import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const { id: userId, mainc: mainCategory, subc: subCategory } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    desc: "",
    imgUrl: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the current subcategory details when the component mounts
    const fetchSubCategoryDetails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/home/getSubCat/${mainCategory}/${subCategory}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData({
          name: response.data.category.subCategory,
          budget: response.data.category.budget,
          desc: response.data.category.desc,
        });
      } catch (error) {
        setError("Error fetching subcategory details.");
        console.error(error);
      }
    };

    fetchSubCategoryDetails();
  }, [mainCategory, subCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/home/${mainCategory}/${subCategory}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      navigate(`/home/${userId}`);
    } catch (error) {
      setError("Error updating subcategory.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 via-gray-700 to-gray-600 text-green-400">
      <div className="backbtn pl-10 pt-10">
        <button
          onClick={() => navigate(`/home/${userId}`)}
          className="md:text-xl w-max sm:text-base text-sm font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400"
        >
          Go Back
        </button>
      </div>
      <div className="flex flex-col items-center py-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
          Edit Subcategory - {subCategory}
        </h2>
        {error && <p className="text-red-500">{error}</p>}

        <form
          className="space-y-4 sm:space-y-6 w-11/12 max-w-md"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm mb-2">
              Subcategory Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter subcategory name"
              required
            />
          </div>

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

          {(mainCategory === "Outflow" || mainCategory === "outflow") && (
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
                placeholder="Enter budget"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 sm:py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Update Subcategory
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
