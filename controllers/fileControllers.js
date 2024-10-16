const mongoose = require('mongoose');
const User = require('../models/user');
const Folder = require('../models/folder');
const File = require('../models/file');
const handleUpload = require('../util/cloudinary');
const cloudinary = require("cloudinary").v2;

const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      res.json({ message: 'File not found in database' });
      return;
    }

    const cloudinaryId = file.cloudinaryId;
    const cldRes = await cloudinary.api.resource(cloudinaryId);

    if (!cldRes) {
      return res.json({ message: 'File not found in Cloudinary' });
    }

    const response = {
      _id: file._id,
      name: file.name,
      fileType: file.fileType,
      path: file.path,
      cloudinaryId: file.cloudinaryId,
      size: file.size,
      sharedWith: file.sharedWith,
      owner: file.owner,
      parentFolder: file.parentFolder,
      cloudinaryDetails: cldRes,
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: error.message });
  }
};

const createFile = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const { name, parentFolderPath, owner, type, sharedwith } = req.body;
    const parentFolderDoc = await Folder.findOne({ path: parentFolderPath });
    if (!parentFolderDoc) {
      return res.status(404).json({ message: `Parent folder "${parentFolderPath}" not found.` });
    }

    const parentFolderObjectId = parentFolderDoc._id;
    let sanitizedFileName = name;
    console.log(sanitizedFileName);
    sanitizedFileName = name.replace(/[^\w\.\-]/g, '_');
    const customPublicId = `${parentFolderPath}${sanitizedFileName}`;

    const existingFile = await File.findOne({ name: name, parentFolder: parentFolderObjectId });
    if (existingFile) {
      console.log("file already exists!!");
      res.status(409).json({ mes: "file already exists!!!!" });
      return;
    }
    handleUpload(dataURI, {
      public_id: customPublicId,
      display_name: sanitizedFileName,
      resource_type: "auto",
      asset_folder: "vrund" // username required in req
    })
      .then(async cldRes => {
        console.log(cldRes);

        const { secure_url, bytes, asset_id, public_id } = cldRes;

        const ownerObjectId = owner ? new mongoose.Types.ObjectId(owner) : undefined;

        const newFile = new File({
          name,
          sanitizedName: sanitizedFileName,
          fileType: type,
          path: secure_url,
          asset_id: asset_id,
          cloudinaryId: public_id,
          parentFolder: parentFolderObjectId,
          owner: ownerObjectId,
          size: bytes.toString(),
          sharedWith: sharedwith || []
        });

        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', details: cldRes });
      })
      .catch(error => {
        console.error('Cloudinary upload failed:', error);
        res.status(500).json({ message: 'Failed to upload to Cloudinary' });
      });
  } catch (error) {
    console.log(error);
  }
};

const updateFileById = async (req, res) => {
  try {
    const { item, newName, current_path } = req.body;
    //console.log(req.body);
    const file = await File.findById(item._id);
    // console.log(req.params.id);
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }
    console.log(item.cloudinaryId);
    const newPublicId = `${current_path}${newName.replace(/\s+/g, '_')}`;
    const cldRes = await cloudinary.uploader.rename(item.cloudinaryId.toString(), newPublicId);
    console.log(cldRes);
    if (!cldRes) {
      return res.status(500).json({ message: 'Failed to update file on Cloudinary' });
    }
    else {
      file.name = newName;
      file.cloudinaryId = newPublicId;
      file.path = cldRes.secure_url;
    }
    await file.save();

    return res.status(200).json({ message: 'File updated successfully', file });

  } catch (error) {
    console.error("Error updating file:", error);
    res.json({ error: error.message });
  }
};


const deleteFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const public_id = file.cloudinaryId;

    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
      console.log(`File with public_id ${public_id} deleted from Cloudinary`);
    }

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'File deleted successfully' });

  } catch (error) {
    console.log("Error deleting file:", error);
    res.status(500).json({ error: error.message });
  }
};


const shareFileWithUser = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const { userId } = req.body;

    // Check if the file exists
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure the user is not the owner of the file
    if (file.owner.toString() === userId) {
      return res.status(400).json({ message: 'Cannot share a file with the owner' });
    }

    // Add the user to the sharedWith array if not already present
    if (!file.sharedWith.includes(userId)) {
      file.sharedWith.push(userId);
      await file.save();
    }

    res.status(200).json({ message: 'File shared successfully', file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSharedFilesForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all files shared with the user
    const sharedFiles = await File.find({ sharedWith: userId });

    if (!sharedFiles.length) {
      return res.status(404).json({ message: 'No files shared with this user' });
    }

    res.status(200).json(sharedFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  shareFileWithUser,
  getFileById,
  createFile,
  updateFileById,
  deleteFileById,
  getSharedFilesForUser,
};
