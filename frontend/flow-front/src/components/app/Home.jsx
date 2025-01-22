import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // State to store categories
  const { id: userId } = useParams();
  const [searchVal, setSearchVal] = useState("");

  const updateSearchVal = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal == "") {
      return;
    }
    navigate(`/home/${userId}/search/${searchVal}`);
  };

  const logOut = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchApi = async () => {
    setLoading(true);
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

  const handleDelSub = async (category) => {
    console.log(category);
    const delMainCat = category.mainCategory;
    const delSubId = category.subCategoryId;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      } else {
        const resp = await axios.delete(
          `${import.meta.env.VITE_API_URL}/home/${delMainCat}/${delSubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(resp);
        // Reload categories after successful deletion
        fetchApi();
      }
    } catch (error) {
      console.log(error);
    }
    console.log("delete clicked");
  };

  return (
    <div className="bg-cover bg-center h-screen bg-[url('/buildings.jpg')] overflow-y-scroll">
      {loading ? (
        <div className="p-10 text-yellow-600 font-semibold">
          Please wait, Loading...
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="btns flex justify-between w-full">
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

          <form
            className="flex items-center md:gap-4 gap-2 bg-slate-500 sm:p-4 p-2 rounded lg:w-1/3 md:w-1/3 sm:w-1/2 w-2/3"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              name="searchCat"
              id="searchCat"
              placeholder="Enter Category to search"
              className="p-2 border rounded"
              onChange={updateSearchVal}
            />
            <input
              type="submit"
              value="Search"
              className="md:px-4 md:py-2 px-1 py-1 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
            />
          </form>
          {/* Display categories in a grid layout */}
          <div className="categories-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={index}
                  className="category-item cursor-pointer bg-gray-700 m-2 bg-opacity-80 rounded-md text-white flex flex-col sm:text-base text-sm md:text-xl overflow-hidden"
                >
                  <div
                    className="subcatdetails hover:bg-slate-600 rounded-md p-4"
                    onClick={() =>
                      handleCatClick(
                        category.mainCategory,
                        category.subCategoryName
                      )
                    }
                  >
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
                  <button
                    className="border-red-500 text-red-400 hover:text-black hover:bg-red-500"
                    onClick={() => {
                      handleDelSub(category);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="text-fuchsia-600 flex justify-center text-base sm:text-xl md:text-2xl">
                No categories available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
