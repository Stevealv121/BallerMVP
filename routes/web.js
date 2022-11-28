const express = require('express');
const router = express.Router()
const { getQr, getCalendarEventById } = require('../controllers/web')

router.use('/qr', getQr)
router
    .route('/event/:id')
    .get(getCalendarEventById)

module.exports = router