import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

function Logout() {

  const [username, loggedIn, userId, setIsLoggedIn] = useContext(AuthContext);
  setIsLoggedIn(false);

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="mb-5 text-gray-900 font-mono font-bold text-xl">Successfully Logged Out</h2>
      <Link to="/login" className="bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors">
        Log In Again
      </Link>
    </div>
  );
}

export default Logout;
