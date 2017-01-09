const express = require('express');
const router = express.Router();

const listController = require('../controller/list');

router.get('/:supplier', listController.listBy.bind(listController, listController.PARAMETERS.supplier));

module.exports = router;