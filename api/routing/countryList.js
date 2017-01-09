const express = require('express');
const router = express.Router();

const listController = require('../controller/list');

router.get(['/:country', '/:country/:region'], listController.listBy.bind(listController, listController.PARAMETERS.country));

module.exports = router;