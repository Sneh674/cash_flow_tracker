import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Edittransac = () => {
  const {
    id: userId,
    mainc: mainCategory,
    subc: subCategory,
    tid: transacId,
  } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    note: "",
    date: "",
    time: "",
  });

  const fetchTransacDetails = async () => {
    try {
      const token=localStorage.getItem('token')
      if(!token){navigate("/")}
      const resp = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/home/getTransac/${mainCategory}/${subCategory}/${transacId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(resp.data.category);
      const transaction = resp.data.category;
      const transactionDate = new Date(transaction.date);

      setFormData({
        amount: transaction.amount,
        note: transaction.note,
        date: transactionDate.toISOString().split("T")[0], // Extract date (YYYY-MM-DD)
        time: transactionDate.toTimeString().split(" ")[0].slice(0, 5), // Extract time (HH:mm)
      });
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  useEffect(() => {
    fetchTransacDetails();
  }, []);

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

    // Combine date and time into ISO string
    const combinedDateTime = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    try {
      // console.log({...formData, date: combinedDateTime})
      const resp = await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/home/${mainCategory}/${subCategory}/${transacId}`,
        { ...formData, date: combinedDateTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(resp)
      navigate(`/home/${userId}/selectedsubcat/${mainCategory}/${subCategory}`)
    } catch (error) {
      console.error("Error updating transaction:", error);
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
        <h2 className="text-xl md:text-2xl font-bold mb-6">Edit Transaction</h2>
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
              value={formData.amount}
              onChange={handleChange}
              required
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
              value={formData.note}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-900 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm mb-2 font-semibold">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-900 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm mb-2 font-semibold">
              Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-gray-900 border border-green-400 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-black py-2 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Update Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edittransac;
