const {createRoom} = require('../controller/roomController');
const router = require('express').Router();
router.post("/createRoom",createRoom)
module.exports = router;