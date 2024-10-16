const User = require('../models/user');
const Folder = require('../models/folder');
const File = require('../models/file');


const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = new User({ username, password });
    await user.save();

    const defaultFolder = new Folder({
      name: username,
      path: `root/${username}`,
      parentFolder: null,
      owner: user._id,
      sharedWith: []
    });

    await defaultFolder.save();

    res.status(201).json({
      message: 'User created successfully and default folder created',
      user,
      defaultFolder
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, password },
    //   { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserById = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find and delete all folders and files associated with the user
      await Folder.deleteMany({ owner: userId });
      await File.deleteMany({ owner: userId });
  
      // Delete the user
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User and associated folders/files deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getuserFilesandFolders = async (req, res) => {
    try {
      const userId = req.params.id;
      const filePath = req.body.filePath;
      console.log('req body:', req.body);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const parentFolder = await Folder.findOne({ owner: userId, path:filePath });
      // console.log(filePath,'root/');
      if (!parentFolder && filePath !== 'root/') {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
  
      const folders = await Folder.find({
        owner: userId,
        parentFolder: parentFolder._id
      });
  
      const files = await File.find({
        owner: userId,
        parentFolder: parentFolder._id
      });
      
      fileAndFolders = [];
      files.map((f)=>fileAndFolders.push(f));
      folders.map((f)=>fileAndFolders.push(f));

      res.status(200).json(fileAndFolders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  


module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getuserFilesandFolders
};
