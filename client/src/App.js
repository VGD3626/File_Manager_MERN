import './index.css';
import NavigationBar from './components/common/NavigationBar';
import SideBar from './components/common/SideBar';
import Login from './components/Login';
import CreateFolder from './components/CreateFolder';
import UploadFile from './components/UploadFile';
import DisplayFile from './components/FileCard';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { createContext, useState } from 'react';
import Breadcrumb from './components/common/Breadcrumb';
import { ErrorBoundary } from 'react-error-boundary';

export const PathContext = createContext();
export const AuthContext = createContext();
export const FileContext = createContext();

function App() {

  let routes;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [path, setPath] = useState("root/");
  const [username, setUsername] = useState("vrund");
  const [userId, setUserId] = useState("0");
  const mainContentClassName = isLoggedIn? "flex-1 bg-white shadow rounded min-h-screen p-4 ml-[15rem]":"flex-1 bg-white shadow rounded min-h-screen p-4 ml-4";
  const [displayFile, setDisplayFile] = useState(false);

  function getDisplayFileFromChild(df) {
    setDisplayFile(df);
  }

  function fallbackRender({error}) {
    console.log(error);
    return <p></p>;
  }

  if (!isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<Signup/>}></Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  else {
    routes = (
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/dashboard" element={<Dashboard sendDisplayFileToParent={getDisplayFileFromChild} />}></Route>
        <Route path="/createFolder" element={<CreateFolder />}></Route>
        <Route path="/uploadFile" element={<UploadFile />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/displayFile" element={<DisplayFile />}></Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  return (
    <>
      <Router>
        <AuthContext.Provider value={[username, isLoggedIn, userId, setIsLoggedIn]}>
        <FileContext.Provider value={[displayFile, setDisplayFile]}>
        <ErrorBoundary fallbackRender={fallbackRender}>

          <NavigationBar isVisible={isLoggedIn}></NavigationBar>
          <div className="flex">
            <SideBar isVisible={isLoggedIn} displayingFile={displayFile}></SideBar>

            <PathContext.Provider value={[path, setPath]}>
              <main className={mainContentClassName}>
                <Breadcrumb isVisible={isLoggedIn} />
                {routes}
              </main>
            </PathContext.Provider>

          </div>
        </ErrorBoundary>
        </FileContext.Provider>
        </AuthContext.Provider>
      </Router>
    </>
  );
}

export default App;
