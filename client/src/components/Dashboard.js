import React, { useState, useEffect, useContext } from 'react';
import ItemIcon from './common/ItemIcon';
import axios from 'axios';
import { PathContext } from '../App';
import FileCard from './FileCard';
import { FaSort, FaFilter } from 'react-icons/fa';
import { FileContext } from '../App';

function Dashboard(props) {
	const [items, setItems] = useState([]);
	const [displayFile, setDisplayFile] = useContext(FileContext);
	const [contextMenu, setContextMenu] = useState(null);
	const [selectedFileId, setSelectedFileId] = useState("0");
	const [path, setPath] = useContext(PathContext);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortType, setSortType] = useState("name-asc");
	const [filterType, setFilterType] = useState("");
	const [data, setData] = useState([]);
	const [noFilesFound, setNoFilesFound] = useState(false);

	const userId = '66bef68cc89ad99d26d92df1';

	useEffect(() => {
		const fileName = path.split('/').pop();
		const matchedFile = data.find(item => item.name === fileName);
		window.scrollTo({ top: 52, behavior: 'smooth' });
		if (matchedFile) {
			setDisplayFile(true);
		} else {
			setDisplayFile(false);
		}
	}, [path, data, setDisplayFile]);

	useEffect(() => {
		setNoFilesFound(items.length === 0);
	}, [items]);

	const fetchData = async (userId, path, setData, ignore) => {
		try {
			const response = await fetch(`http://localhost:5000/users/${userId}/file-and-folders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ filePath: path }),
			});
			const data = await response.json();
			if (!ignore) {
				setData(data);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		console.log(filterType, searchQuery);
		let result = [...data];

		if (filterType) {
			result = result.filter((item) => {
				if (item.fileType) {
					console.log(filterType.split('|'));
					let f = false;
					filterType.split('|').map((i) => {
						if (item.fileType.toLowerCase().includes(i) || item.name.toLowerCase().includes(i)) f = true;
					});
					return f;
				}
				return filterType === 'folder';
			});
		}

		setItems(result);
		console.log(result, items);
		if (searchQuery) {
			result = result.filter(item =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (sortType.includes("name")) {
			result.sort((a, b) => {
				if (sortType === "name-asc") return a.name.localeCompare(b.name);
				return b.name.localeCompare(a.name);
			});
		} else if (sortType.includes("time")) {
			result.sort((a, b) => {
				if (sortType === "time-desc") return new Date(a.createdAt) - new Date(b.createdAt);
				return new Date(b.createdAt) - new Date(a.createdAt);
			});
		}

		setItems(result);
	}, [filterType, sortType, searchQuery, data]);



	function setSelectedFileIdFromChild(sfi) {
		setSelectedFileId(sfi);
	}

	useEffect(() => {
		let ignore = false;
		if (displayFile) {
			return () => {
				ignore = true;
			};
		}
		fetchData(userId, path, setData, ignore);
		return () => {
			ignore = true;
		};
	}, [path]);

	function setSelectedFileIdFromChild(sfi) {
		setSelectedFileId(sfi);
	}

	function handleRightClick(e, item) {
		e.preventDefault();
		setSelectedFileId(item._id);
		setContextMenu({
			x: e.pageX,
			y: e.pageY,
			item
		});
	}

	async function handleRename(item) {
		const newName = prompt("Enter new name:", item.name);
		if (newName) {
			try {
				let response;
				if (item.fileType) {
					response = await axios.put(`http://localhost:5000/files/${item._id}`, { item: item, newName: newName, current_path: path });
				} else {
					response = await axios.put(`http://localhost:5000/folders/${item._id}`, { item: item, newName: newName, current_path: path });
				}
				fetchData(userId, path, setData, false);
				alert(response.data.message);
			} catch (error) {
				console.error("Error renaming file:", error);
				alert("An error occurred while renaming the file.");
			}
		}
		setContextMenu(null);
	}

	async function handleDelete(item) {
		const confirmDelete = window.confirm(`Are you sure you want to delete ${item.name}?`);
		if (confirmDelete) {
			try {
				let response;
				if (item.fileType) {
					response = await axios.delete(`http://localhost:5000/files/${item._id}`);
				} else {
					response = await axios.delete(`http://localhost:5000/folders/${item._id}`);
				}
				fetchData(userId, path, setData, false);
				alert(response.data.message);
			} catch (error) {
				console.error("Error deleting file:", error);
				alert("An error occurred while deleting the file.");
			}
		}
		setContextMenu(null);
	}

	useEffect(() => {
		function handleClickOutside(event) {
			if (contextMenu && !event.target.closest('.context-menu')) {
				setContextMenu(null);
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [contextMenu]);


	return (
		<div className="p-4">
			{!displayFile && (
				<div className="overflow-y-auto z-40 w-10/12 opacity-80 text-opacity-100 fixed top-28 flex items-center gap-4">
					<input
						type="text"
						placeholder="Search files..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="mb-4 w-5/12 p-2 caret-black border border-transparent rounded bg-slate-200 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-transparent"
					/>
					<div className="flex items-center fixed top-28 right-5 gap-4">
						<div className="flex items-center">
							<FaSort className="text-black cursor-pointer mr-2" />
							<select
								onChange={(e) => setSortType(e.target.value)}
								className="p-2 bg-slate-200 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-transparent"
							>
								<option value="name-asc">Sort by Name (A-Z)</option>
								<option value="name-desc">Sort by Name (Z-A)</option>
								<option value="time-asc">Sort by Time (Newest first)</option>
								<option value="time-desc">Sort by Time (Oldest first)</option>
							</select>
						</div>
						<div className="flex items-center">
							<FaFilter className="text-black cursor-pointer mr-2" />
							<select
								onChange={(e) => setFilterType(e.target.value)}
								className="p-2 bg-slate-200 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-transparent"
							>
								<option value="">All files</option>
								<option value="document|.pdf|.doc|.docx|.odt|.rtf|.txt">Document</option>
								<option value="image|.png|.jpg|.jpeg|.gif|.bmp|.tiff|.svg|.webp">Image</option>
								<option value="video|.mp4|.mkv|.avi|.mov|.wmv|.flv|.webm|.m4v">Video</option>
								<option value="audio|.mp3|.wav|.flac|.aac|.ogg|.wma|.m4a">Audio</option>
								<option value="text|.txt|.md|.csv|.log|.json|.xml|.yaml|.yml">Text</option>
								<option value="programming|.js|.ts|.java|.cpp|.c|.cs|.py|.rb|.php|.html|.css|.json|.xml|.go|.swift|.kt|.rs|.pl|.sh">Programming file</option>
								<option value="powerpoint|.ppt|.pptx|.odp">PowerPoint Document</option>
								<option value="spreadsheet|.xls|.xlsx|.ods|.csv">Spreadsheet</option>
								<option value="archive|.zip|.rar|.7z|.tar|.gz|.bz2">Archive</option>

							</select>
						</div>
					</div>
				</div>
			)}

			<div className="mt-32">
				{displayFile ? (
					<FileCard file={(items.filter((i) => i._id === selectedFileId))[0]} />
				) : noFilesFound ? (
					<p className='text-red-600 top-52'>
						No files or folders found...
					</p>) : (
					<div className="flex flex-wrap gap-6">

						{items && items.map((item) => (
							<div
								key={item._id}
								onContextMenu={(e) => handleRightClick(e, item)}
							>
								<ItemIcon setSelectedFileId={setSelectedFileIdFromChild} isSelected={selectedFileId === item._id} item={item} />
							</div>
						))}
					</div>
				)}
				{contextMenu && (
					<div
						className="absolute bg-slate-50 text-black shadow-md p-3 rounded-lg context-menu"
						style={{ top: contextMenu.y, left: contextMenu.x, opacity: 0.9 }}
					>
						<p className="font-bold text-lg mb-2">{contextMenu.item.name}</p>
						
						<p className="text-sm">
							<span className="font-semibold">Type: </span>
							{contextMenu.item.fileType ? contextMenu.item.fileType : "Folder"}
						</p>
						
						{contextMenu.item.size && (
							<p className="text-sm">
								<span className="font-semibold">Size: </span>
								{contextMenu.item.size} bytes
							</p>
						)}
				
						<p className="text-sm">
							<span className="font-semibold">Created: </span>
							{new Date(contextMenu.item.createdAt).toLocaleString()}
						</p>
						
						{contextMenu.item.updatedAt && (
							<p className="text-sm">
								<span className="font-semibold">Last Modified: </span>
								{new Date(contextMenu.item.updatedAt).toLocaleString()}
							</p>
						)}
						
						{contextMenu.item.path && (
							<p className="text-sm break-all">
								<span className="font-semibold">Path: </span>
								{path+contextMenu.item.name}
							</p>
						)}
				
						<div className="mt-4">
							<button
								onClick={() => handleRename(contextMenu.item)}
								className="block text-blue-400 hover:text-blue-500 mb-2"
							>
								Rename
							</button>
							<button
								onClick={() => handleDelete(contextMenu.item)}
								className="block text-red-400 hover:text-red-500"
							>
								Delete
							</button>
						</div>
					</div>
				)}
				
			</div>
		</div>
	);
}

export default Dashboard;
