import React, { useState, useContext } from 'react';
import { AuthContext, PathContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [path, setPath] = useContext(PathContext);
  const [username, loggedIn, userId, setIsLoggedIn] = useContext(AuthContext);
  const navigate = useNavigate();

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (selectedFile) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", selectedFile.name);
      formData.append("parentFolderPath", path);
      formData.append("owner", "66bef68cc89ad99d26d92df1");
      formData.append("type", selectedFile.type || "other");

      try {
        const response = await axios.post("http://localhost:5000/files", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: "your-token-here",
          },
        });

        setSelectedFile(null);
        alert("File uploaded successfully!");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert("File already exists!!");
        } else {
          alert(`Failed to upload the file.`);
        }
      }
    } else {
      alert("Please select a file to upload.");
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
            <div className="flex items-center">
              <label className="bg-slate-400 hover:bg-slate-600 text-white py-2 px-4 rounded-md shadow-lg cursor-pointer flex items-center">
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                Choose File to upload
              </label>
              {selectedFile && (
                <span className="ml-4 text-sm text-gray-500 truncate">
                  {selectedFile.name}
                </span>
              )}
            </div>
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
              className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadFile;
