const express = require('express');
const router = express.Router();

const listController = require('../controller/list');

router.get('/:producer', listController.listBy.bind(listController, listController.PARAMETERS.producer));

module.exports = router;