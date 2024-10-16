import React, { useState, useContext } from 'react';
import { FaFolder, FaFileAlt } from 'react-icons/fa';
import { FileContext, PathContext } from '../../App';

function ItemIcon(props) {
  const [path, setPath] = useContext(PathContext);
  const [displayFile, setDisplayFile] = useContext(FileContext);

  const handleItemClick = () => {
    console.log('item clicked');
    if (props.item.fileType) {
      setDisplayFile(true);
      props.setSelectedFileId(props.item._id);
      setPath(props.item.cloudinaryId);
    } else {
      setDisplayFile(false);
      setPath(props.item.path);
    }
  };

  const iconProps = {
    size: props.isSelected ? 50 : 50,
    className: !props.item.fileType ? 'text-yellow-400' : 'text-blue-500',
  };

  const containerClasses = `flex p-4 flex-col items-center cursor-pointer 
    ${props.isSelected ? 'w-36 bg-slate-100 rounded-md' : 'w-36'} mx-4`;

  return (
    <div
      className={containerClasses}
      onDoubleClick={() => {}}
      onClick={handleItemClick}
    >
      {!props.item.fileType ? <FaFolder {...iconProps} /> : <FaFileAlt {...iconProps} />}
      <span
        className={`mt-2 text-center ${props.isSelected ? 'font-bold' : ''}`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          wordBreak: 'break-all',
          maxWidth: '100%',
        }}
      >
        {props.item.name}
      </span>
    </div>
  );
}

export default ItemIcon;
