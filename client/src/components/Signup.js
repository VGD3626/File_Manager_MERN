import React from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="max-w-[280px] mx-auto">
      <div className="flex flex-col items-center mt-[10vh]">
        <h2 className="mb-5 text-gray-900 font-mono font-bold text-xl">Sign Up</h2>
        <form>
          <input 
            type="text" 
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium" 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium" 
            placeholder="Password" 
            required 
          />
          <input 
            type="password" 
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium" 
            placeholder="Confirm password" 
            required 
          />
          <button 
            type="submit" 
            className="bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3 text-[14px]">
          Already have an account? 
          <Link to="/login" className="text-gray-600"> Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
