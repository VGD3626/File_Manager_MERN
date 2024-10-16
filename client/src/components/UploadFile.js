import React, { useState, useContext } from 'react';
import { AuthContext, PathContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [path, setPath] = useContext(PathContext);
  const [username, loggedIn, userId, setIsLoggedIn] = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCreatingTextFile, setIsCreatingTextFile] = useState(false);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
    setIsCreatingTextFile(false);
  }

  function removeFile() {
    setSelectedFile(null);
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (isCreatingTextFile && textInput) {
      try {
        if (textInput.trim()) {
          let formData = new FormData();
          const blob = new Blob([textInput], { type: 'text/plain' });
          formData.append("file", blob);
          formData.append("name", fileTitle.endsWith('.txt') ? fileTitle : `${fileTitle}.txt`);
          formData.append("parentFolderPath", path);
          formData.append("owner", "66bef68cc89ad99d26d92df1");
          formData.append("type", "text/plain");
    
          try {
            const response = await axios.post("http://localhost:5000/files", formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                authorization: "your-token-here",
              },
            });
    
            setTextInput('');
            alert("File created and uploaded successfully!");
          } catch (error) {
            if (error.response && error.response.status === 409) {
              alert("File already exists!!");
            } else {
              alert(`Failed to create the file.`);
            }
          }
        } else {
          alert("Please enter some text to create a file.");
        }
      }    
       catch (error) {
        alert(`Failed to create text file.`);
      }
    } else if (selectedFile) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", selectedFile.name);
      formData.append("parentFolderPath", path);
      formData.append("owner", "66bef68cc89ad99d26d92df1");
      formData.append("type", selectedFile.type || "other");

      try {
        await axios.post("http://localhost:5000/files", formData, {
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
      alert("Please provide a text input or select a file to upload.");
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
        className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[30rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit}>
          <div className="mb-4">
          <input
              type="text"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Enter file title"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
            />
            <div className="flex items-center mb-4">
              <label className="bg-slate-400 hover:bg-slate-600 text-white py-2 px-4 rounded-md shadow-lg cursor-pointer flex items-center">
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isCreatingTextFile}
                />
                Choose File to upload
              </label>
              {selectedFile && (
                <div className="ml-4 flex items-center">
                  <span className="text-sm text-gray-500 truncate">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md shadow-lg focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4">
              <textarea
                className="w-full h-[17rem] p-2 border border-gray-300 rounded"
                placeholder="Enter text here for text file creation"
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setIsCreatingTextFile(true);
                  setSelectedFile(null);
                }}
                disabled={selectedFile !== null}
              />
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadFile;
