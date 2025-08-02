const express = require('express');
const multer = require('multer');
const {
    handleCreateTask,
    handleGetTasks,
    handleGetTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDownloadFile
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.use(protect);

router.get('/', handleGetTasks);
router.get('/:id', handleGetTask);
router.post('/', upload.array('documents', 3), handleCreateTask);
router.put('/:id', upload.array('documents', 3), handleUpdateTask);
router.delete('/:id', handleDeleteTask);
router.get('/download/:filename', handleDownloadFile);

module.exports = router;