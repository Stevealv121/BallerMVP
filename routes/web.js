const express = require('express');
const router = express.Router()
const { getQr, getCalendarEventById, getCalendarEventsByOwner } = require('../controllers/web')

router.use('/qr', getQr)
router
    .route('/calendar/event/:id')
    .get(getCalendarEventById)

router
    .route('/calendar/events/:id')
    .get(getCalendarEventsByOwner)

module.exports = router