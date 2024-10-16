const User = require('../models/user');
const Folder = require('../models/folder');
const File = require('../models/file');
const mongoose = require('mongoose');



const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const createFolder = async (req, res) => {
  try {
    const { name, parentFolderPath, owner, sharedWith } = req.body;

    let path;
    
    const parentFolderDoc = await Folder.findOne({ path: parentFolderPath });
    if (!parentFolderDoc) {
      console.log("here",parentFolderPath,name,owner);
      return res.status(404).json({ message: `Parent folder "${parentFolderPath}" not found.` });
    }

    const parentFolder = parentFolderDoc._id;
    

    if(parentFolder != null)
    {
        const parentfolder = await Folder.findById(parentFolder);
        path = parentfolder.path + name + "/";
    }
    else
    {
        path = "root/";
    }

    const folder = new Folder({ 
      name,  
      path, 
      parentFolder, 
      owner,
      sharedWith
    });

    await folder.save();
    res.status(201).json({ message: 'Folder created successfully', f: folder });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};


const updateFolderById = async (req, res) => {
    try {
      const { item, newName, current_path } = req.body;
  
      // If sharedWith is provded
      if (item.sharedWith) {
        updateData.sharedWith = item.sharedWith;
      }
      item.name = newName;
      pf = await Folder.findOne({_id:item.parentFolder});
      // console.log(pf);
      if(pf) {
        item.path = pf.path+newName+'/';
      }
      const folder = await Folder.findByIdAndUpdate(
        req.params.id,
        item,
        { new: true }
      );
      
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
      
      res.status(200).json({ message: 'Folder updated successfully', folder });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  

  const deleteFolderById = async (req, res) => {
    try {
      const folder = await Folder.findByIdAndDelete(req.params.id);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
      res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const shareFolderWithUser = async (req, res) => {
    try {
      const folderId = req.params.folderId;
      const { userId } = req.body;
  
      // Check if the folder exists
      const folder = await Folder.findById(folderId);
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found' });
      }
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the user to the sharedWith array if not already present
      if (!folder.sharedWith.includes(userId)) {
        folder.sharedWith.push(userId);
        await folder.save();
      }
  
      res.status(200).json({ message: 'Folder shared successfully', folder });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getSharedFoldersForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find all folders shared with the user
      const sharedFolders = await Folder.find({ sharedWith: userId });
  
      if (!sharedFolders.length) {
        return res.status(404).json({ message: 'No folders shared with this user' });
      }
  
      res.status(200).json(sharedFolders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {
    shareFolderWithUser,
    updateFolderById,
    deleteFolderById,
    createFolder,
    getFolderById,
    getSharedFoldersForUser     
  };
