import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // State to store categories
  const { id: userId } = useParams();

  const logOut = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchApi = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_API_URL}/home/showAllCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(resp);
        setCategories(resp.data.allCategories || []); // Assuming the API response contains categories
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddCat = () => {
    navigate(`/home/${userId}/addcat`);
  };

  const handleCatClick = (maincat, subcat) => {
    navigate(`/home/${userId}/selectedsubcat/${maincat}/${subcat}`);
    // alert("fwsefsdc")
  };

  useEffect(() => {
    setLoading(true);
    fetchApi();

    // Prevent back navigation using pushState
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      localStorage.removeItem("token");
      window.history.pushState(null, "", window.location.href); // Keeps the user on the same page
      navigate("/");
    };
    window.addEventListener("popstate", handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="bg-cover bg-center h-screen bg-[url('/buildings.jpg')] overflow-y-scroll">
      {loading ? (
        <div className="p-10 text-yellow-600 font-semibold">
          Please wait, Loading...
        </div>
      ) : (
        <div className="">
          <div className="btns flex justify-between">
            <button
              onClick={logOut}
              className="w-max m-3 md:m-5 md:text-xl text-black border-cyan-500 bg-cyan-400 text-base font-bold hover:font-extrabold hover:bg-green-400"
            >
              Log Out
            </button>
            <button
              onClick={handleAddCat}
              className="w-max m-3 md:m-5 md:text-xl text-base text-black border-cyan-500 bg-cyan-400 bg-opacity-70 font-bold hover:font-extrabold hover:bg-green-400"
            >
              Add Category
            </button>
          </div>

          {/* Display categories in a grid layout */}
          <div className="categories-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={index}
                  className="category-item cursor-pointer bg-gray-700 m-2 bg-opacity-80 rounded-md text-white flex flex-col sm:text-base text-sm md:text-xl overflow-hidden"
                >
                  <div className="subcatdetails hover:bg-slate-600 rounded-md p-4" onClick={() =>
                    handleCatClick(
                      category.mainCategory,
                      category.subCategoryName
                    )
                  }>
                    <div className="text-base smtext-lg md:text-2xl font-semibold">
                      Flow Type: {category.mainCategory}
                    </div>
                    <div className="md:h-9 md:overflow-hidden">
                      Category Name: {category.subCategoryName}
                    </div>
                    <div className="md:h-20 overflow-y-scroll scrollbar-hide h-14">
                      Description: {category.description}
                    </div>
                  </div>

                  <Link
                    to={`/home/${userId}/editsubcat/${category.mainCategory}/${category.subCategoryName}`}
                    className="text-blue-400 hover:text-green-400 hover:bg-slate-600 rounded-md p-3 flex justify-center"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-fuchsia-600 flex justify-center text-base sm:text-xl md:text-2xl">No categories available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
