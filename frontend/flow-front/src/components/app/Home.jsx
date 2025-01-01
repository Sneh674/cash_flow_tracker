import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const logOut = async () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchApi = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchApi();
    
    // Prevent back navigation using pushState
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
        localStorage.removeItem('token')
      window.history.pushState(null, '', window.location.href); // Keeps the user on the same page
      navigate("/")
    };
    window.addEventListener('popstate', handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [fetchApi, navigate]);

  return (
    <div>
      {loading ? (
        <div className='p-10 text-green-300 font-semibold'>Please wait, Loading...</div>
      ) : (
        <div>
          <div className="logoutbtn">
            <button onClick={logOut}>Log Out</button>
          </div>
          Hello
        </div>
      )}
    </div>
  );
};

export default Home;
