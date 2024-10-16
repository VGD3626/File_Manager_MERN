const express = require("express");
const folderControllers = require("../controllers/folderControllers");
var router = express.Router();

router.post('/', folderControllers.createFolder);
router.get('/:id', folderControllers.getFolderById);
router.put('/:id', folderControllers.updateFolderById);
router.delete('/:id', folderControllers.deleteFolderById);
router.post('/:folderId/share', folderControllers.shareFolderWithUser);
router.get('/shared/:userId', folderControllers.getSharedFoldersForUser);

module.exports = router;

