var express = require('express');
var router = express.Router();

var controller = require('../controllers/data.controller.js');

router.post('/write', controller.write)
router.post('/delete', controller.delete)
router.post('/edit', controller.edit)
router.get('/read', controller.read)
router.get('/readAll', controller.readAll)
router.get('/readInfor', controller.readInfor)
module.exports = router;