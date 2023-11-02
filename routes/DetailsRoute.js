const express = require("express");
const { getDetails } = require("../controllers/detailsController");
const router = express.Router();


router.post('/send-sms',getDetails);

module.exports =router;