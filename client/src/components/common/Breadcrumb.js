import React, { useContext } from 'react';
import { PathContext } from '../../App';
import { NavLink } from 'react-router-dom';
import { FaChevronRight, FaInfoCircle } from 'react-icons/fa';

function Breadcrumb(props) {
    const [path, setPath] = useContext(PathContext);

    const handlePathChange = (index) => {
        const newPath = path.split('/').slice(0, index + 1).join('/')+'/';
        console.log(path);
        setPath(newPath);
    };

    if (!props.isVisible) {
        return null;
    }

    return (
        <div className="breadcrumb fixed z-10 top-16 pl-5 left-60 w-10/12 bg-indigo-50 p-2 flex items-center space-x-2">
            <FaInfoCircle></FaInfoCircle>
            {path.split('/').map((element, index) => (
                <React.Fragment key={index}>
                    <NavLink
                        to="#"
                        className="text-gray-800 font-bold hover:text-blue-500 transition duration-200 ease-in-out flex items-center"
                        onClick={() => handlePathChange(index)}
                    >
                        {element}
                    </NavLink>
                    {index < path.split('/').length - 1 && (
                        <FaChevronRight className="text-gray-500 mx-2" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default Breadcrumb;
