import React from 'react';
import { NavLink } from 'react-router-dom';

function SideBar(props) {
    if (!props.isVisible) {
        return null;
    }

    return (
        <div className="fixed top-15 z-30 flex flex-col bg-clip-border bg-slate-700 text-white h-screen w-full max-w-[15rem] p-4 shadow-lg shadow-gray-900/5">
            <nav className="flex flex-col gap-2 min-w-[240px] p-2 text-base font-normal font-alfa-slab-one"> {/* Change here */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center w-full p-3 text-start leading-tight transition-all hover:bg-gray-700 ${isActive ? 'text-orange-50 bg-gray-800' : 'text-gray-300'
                        }`
                    }
                >
                    <div className="grid place-items-center mr-4">
                        <i className="material-icons">home</i>
                    </div>
                    Home
                </NavLink>

                {!props.displayingFile && (<NavLink
                    to="/createFolder"
                    className={({ isActive }) =>
                        `flex items-center w-full p-3 text-start leading-tight transition-all hover:bg-gray-700 ${isActive ? 'text-white bg-gray-900' : 'text-gray-300'
                        }`
                    }
                >
                    <div className="grid place-items-center mr-4">
                        <i className="material-icons">create_new_folder</i>
                    </div>
                    Create Folder
                </NavLink>)}

                {!props.displayingFile && <NavLink
                    to="/uploadFile"
                    className={({ isActive }) =>
                        `flex items-center w-full p-3 text-start leading-tight transition-all hover:bg-gray-700 ${isActive ? 'text-white bg-gray-900' : 'text-gray-300'
                        }`
                    }
                >
                    <div className="grid place-items-center mr-4">
                        <i className="material-icons">file_upload</i>
                    </div>
                    File Upload
                </NavLink>}

                <NavLink
                    to="/logout"
                    className={({ isActive }) =>
                        `flex items-center w-full p-3 text-start leading-tight transition-all hover:bg-gray-700 ${isActive ? 'text-white bg-gray-900' : 'text-gray-300'
                        }`
                    }
                >
                    <div className="grid place-items-center mr-4">
                        <i className="material-icons">logout</i>
                    </div>
                    Log Out
                </NavLink>
            </nav>
        </div>
    );
}

export default SideBar;
