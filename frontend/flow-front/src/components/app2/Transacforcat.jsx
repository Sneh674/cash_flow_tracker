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

  const handleAddTransac=()=>{
    navigate(`/home/${userId}/addtransaction/${mainCategory}/${subCategory}`)
  }

  return (
    <div>
      <div className="backbtn p-10 pt-7 flex justify-between">
        <button
          onClick={() => navigate(`/home/${userId}`)}
          className="md:text-xl w-max sm:text-base text-sm font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400"
        >
          Go Back
        </button>
        <button className="md:text-xl w-max sm:text-base text-sm font-bold hover:bg-green-400 hover:text-black rounded-md md:p-3 p-1.5 border-2 border-green-400" onClick={handleAddTransac}>
          Add Transaction
        </button>
      </div>
      {loading ? (
        <div>Loading ...</div>
      ) : transactions.length > 0 ? (
        <div>
          {transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-card">
              <div>
                <div>Amount: {transaction.amount}</div>
                <div>Note: {transaction.note}</div>
                <div>Date: {new Date(transaction.date).toLocaleString()}</div>
              </div>
              <div>
                <Link to={`/edit/${transaction._id}`}>Edit</Link>
                <button className="w-max">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No transactions so far</div>
      )}
    </div>
  );
};

export default Transacforcat;
