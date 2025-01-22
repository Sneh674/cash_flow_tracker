import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Alltransaction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
  
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
          setLoading(false);
          
  
          const resp = await axios.get(
            `${import.meta.env.VITE_API_URL}/home/showAllTransactions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(resp.data.ans);
          setTransactions(resp.data.ans || []);
        } catch (error) {
          console.log(error);
        }
        // setLoading(false);
      }
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
      <div className="">
        {loading ? (
          <div className="p-10 text-green-300 font-semibold">
            Please wait, Loading...
          </div>
        ) : (
          <div>
            <div className="logoutbtn">
              <button
                onClick={logOut}
                className="w-max m-3 md:m-5 md:text-xl text-base font-bold hover:font-extrabold hover:bg-green-400"
              >
                Log Out
              </button>
            </div>
            
            {transactions.length > 0 ? (
              <div className="bg-gray-900 m-2 p-2 rounded-lg">
                <div>Recent Transactions:</div>
                <div>
                  {transactions.map((transaction, index) => {
                    // Convert MongoDB date to JS Date object
                    const transactionDate = new Date(transaction.date);
  
                    // Extract date and time separately
                    const date = transactionDate.toLocaleDateString(); // e.g., "1/1/2025"
                    const time = transactionDate.toLocaleTimeString(); // e.g., "10:30:00 AM"
  
                    return (
                      <div key={index} className="transaction bg-gray-700 rounded-md p-2 m-2">
                        <div className="flowtype">{transaction.flowType}</div>
                        <div className="subcat">{transaction.sub}</div>
                        <div className="amount">{transaction.amt}</div>
                        <div className="date">Date: {date}</div>
                        <div className="time">Time: {time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 m-2 p-2 rounded-lg">No transaction so far</div>
            )}
          </div>
        )}
      </div>
    );
}

export default Alltransaction
