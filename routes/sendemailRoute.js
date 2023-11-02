const express = require('express');
const { upload } = require('../helper/fileUpload');
const { sendEmail } = require('../controllers/sendEmailcontroller');

const router = express.Router();

router.post('/mail', upload.fields([
    { name: 'files', maxCount: 10 }, // 'files' field can handle multiple files (adjust maxCount accordingly)
    { name: 'idPhoto', maxCount: 1 } // 'idPhoto' field expects a single file
  ]), sendEmail);

module.exports = router