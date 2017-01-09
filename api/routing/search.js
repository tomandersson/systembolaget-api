const express = require('express');
const router = express.Router();
const searchController = require('../controller/search');
router.get('/search', searchController.search);
router.get('/id/:itemId', searchController.findById);

module.exports = router;
