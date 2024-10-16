const express = require("express");
const fileControllers = require("../controllers/fileControllers");
var router = express.Router();
const upload = require("../middlewars/multer.middleware");

router.post('/', upload.single("file"), fileControllers.createFile);
router.get('/:id', fileControllers.getFileById);
router.put('/:id', fileControllers.updateFileById);
router.delete('/:id', fileControllers.deleteFileById);
router.post('/:fileId/share', fileControllers.shareFileWithUser);
router.get('/shared/:userId', fileControllers.getSharedFilesForUser);

module.exports = router;