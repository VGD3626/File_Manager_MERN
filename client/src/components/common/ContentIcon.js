import React from 'react';
import { NavLink } from 'react-router-dom';

const ContentIcon = (props) => {
  return (
    <NavLink to="/myFile" className="flex flex-col items-center text-center">
      <svg className="w-16 h-16 text-green-700" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 3v12a1 1 0 001 1h12a1 1 0 001-1V7l-4-4H4a1 1 0 00-1 1z" />
      </svg>
      <span className="text-green-500 mt-2">myFile</span>
    </NavLink>
  );
};

export default ContentIcon;
