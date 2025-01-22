import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const Transacforcat = () => {
  const { id: userId, mainc: mainCategory, subc: subCategory } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [deleteBox, setDeleteBox] = useState(false);
  const [tid, setTid] = useState("");

  const fetchTransactions = async () => {
    try {
      const resp = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/home/getSubCat/${mainCategory}/${subCategory}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTransactions(resp.data.cat.transactions);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching transactions: ${error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransac = () => {
    navigate(`/home/${userId}/addtransaction/${mainCategory}/${subCategory}`);
  };

  const deleteClick = (transacId) => {
    setTid(transacId);
    setDeleteBox(true);
  };
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    try {
      const resp = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/home/${mainCategory}/${subCategory}/${tid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTid("");
      console.log(resp);
      setDeleteBox(false);
      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-cover bg-center h-screen bg-[url('/card.jpg')] overflow-y-scroll">
      <div className="backbtn p-5 pt-7 flex justify-between items-center">
        <button
          onClick={() => navigate(`/home/${userId}`)}
          className="w-max md:text-xl sm:text-base text-sm bg-gray-800 bg-opacity-80 font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400"
        >
          Go Back
        </button>
        <button
          className="w-max md:text-xl sm:text-base text-sm bg-gray-800 bg-opacity-80 font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400"
          onClick={handleAddTransac}
        >
          Add Transaction
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-10 ">Loading ...</div>
      ) : transactions.length > 0 ? (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="transaction-card bg-gray-800 bg-opacity-80 rounded-md p-4 shadow-lg border border-green-400 hover:shadow-2xl transition duration-300"
            >
              <div className="mb-4">
                <div className="text-sm sm:text-base font-bold">
                  Amount:{" "}
                  <span className="font-normal text-green-300">
                    {transaction.amount}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold">
                  Note:{" "}
                  <span className="font-normal text-green-300">
                    {transaction.note}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold">
                  Date:{" "}
                  <span className="font-normal text-green-300">
                    {new Date(transaction.date).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <Link
                  to={`/home/${userId}/edittransaction/${mainCategory}/${subCategory}/${transaction._id}`}
                  className="text-sm sm:text-base md:text-lg font-bold text-yellow-400 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteClick(transaction._id)}
                  className="text-sm sm:text-base font-bold text-red-500 hover:bg-red-500 hover:border-red-500 hover:ring-2 ring-red-400 w-max"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <span className="w-max mt-10 md:text-3xl sm:text-2xl text-lg bg-emerald-500 backdrop-blur-2xl text-white p-3 rounded-lg bg-opacity-55">No transactions so far</span>
        </div>
      )}
      {deleteBox && (
        <div
          onClick={() => setDeleteBox(false)}
          className="delbox fixed inset-0 flex flex-col align-middle justify-center items-center backdrop-brightness-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="gap-2 sm:gap-5 md:gap-8 md:text-2xl sm:text-xl text-base  flex flex-col items-center bg-slate-600 md:p-10 sm:p-6 p-3 mx-5 rounded-lg"
          >
            <div className="md:text-2xl">
              Are you sure you want to delete this Transaction ?
            </div>
            <div className="delbtn flex justify-evenly w-full">
              <button
                className="w-max sm:px-7 px-4 py-2 text-orange-500 border-orange-500 hover:bg-orange-600 rounded-lg"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="w-max sm:px-7 px-4 py-2 text-cyan-500 border-cyan-500 hover:bg-cyan-600 rounded-lg"
                onClick={() => setDeleteBox(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transacforcat;
