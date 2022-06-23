const express = require('express')
const { addNewMess, getAllMess } = require('../controllers/message.controller')

const router = express.Router()

router.post('/', addNewMess)
router.get('/', getAllMess)

module.exports = router