import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Login() {

  const [username, loggedIn, userId, setIsLoggedIn] = useContext(AuthContext);
  const navigate = useNavigate();

  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");

  function authenticateUser() {
    console.log(uname, pass);
    setIsLoggedIn(true);
    navigate('/dashboard');

  }

  return (
    <div className="max-w-[280px] mx-auto">
      <div className="flex flex-col items-center mt-[10vh]">
        <h2 className="mb-5 text-gray-900 font-mono font-bold text-xl">Log In</h2>
        
        <form>
          <input 
            type="text" 
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium" 
            placeholder="Email" 
            required 
            onChange={(e)=>{setUname(e.target.value)}}
          />
          <input 
            type="password" 
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium" 
            placeholder="Password" 
            required 
            onChange={(e)=>{setPass(e.target.value)}}
          />
          <button 
            type="submit" onClick={authenticateUser}
            className="bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
          >
            Log In
          </button>
        </form>
        <p className="text-center mt-3 text-[14px]">
          Don't have an account? 
          <Link to="/signup" className="text-gray-600"> Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
