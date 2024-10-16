import React, { useContext, useEffect, useState } from 'react';
import { PathContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateFolder() {
  const [path, setPath] = useContext(PathContext);
  const [folderName, setFolderName] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/folders", {
        name: folderName,
        parentFolderPath: path,
        owner: "66bef68cc89ad99d26d92df1"
      }, {
        headers: {
          'Content-Type': 'application/json',
          authorization: "your-token-here",
        },
      });
      if (response) {
        setPath(response.data.f.path);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  }


  function closeModal() {
    navigate('/dashboard');
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              onChange={(e) => setFolderName(e.target.value)}
              type="text"
              id="folderName"
              name="folderName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
              placeholder="Enter folder name"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md shadow focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFolder;
