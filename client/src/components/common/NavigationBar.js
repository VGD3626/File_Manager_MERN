import React from 'react';
import { FaFileArchive, FaFileAudio, FaFileCode, FaFileImage, FaFilePdf, FaFileVideo } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function NavigationBar(props) {
  if (!props.isVisible) {
    return null;
  }

  return (
    <nav className="font-extrabold bg-slate-600 p-4 shadow-lg sticky top-0 z-10 opacity-300">
      <div className="container mx-auto flex justify-between items-center">
        <span className="bg-gradient-to-r text-white  protest-strike-regular text-transparent text-2xl tracking-wider font-bold">
          File Manager
        </span>
        <div className="flex items-center space-x-0">
          <div className="flex space-x-2 text-opacity-5">
            <FaFileCode className="text-white text-3xl" />
            <FaFileImage className="text-indigo-100 text-3xl" />
            <FaFileAudio className="text-indigo-100 text-3xl" />
            <FaFileArchive className="text-indigo-200 text-3xl" />
            <FaFilePdf className="text-indigo-300 text-3xl" />
            <FaFileVideo className="text-indigo-400 text-3xl" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
