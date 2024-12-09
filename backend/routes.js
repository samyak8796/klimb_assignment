const express = require('express');
const multer = require('multer');
const { uploadCandidates } = require('./controller/candidateController')

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCandidates);

module.exports = router;