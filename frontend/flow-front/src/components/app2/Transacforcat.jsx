import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const Transacforcat = () => {
  const { id: userId, mainc: mainCategory, subc: subCategory } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/home/getSubCat/${mainCategory}/${subCategory}`,
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
        <div className="text-center mt-10">Loading ...</div>
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
                <button className="text-sm sm:text-base font-bold text-red-500 hover:bg-red-500 hover:border-red-500 hover:ring-2 ring-red-400 w-max">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">No transactions so far</div>
      )}
    </div>
  );
};

export default Transacforcat;
