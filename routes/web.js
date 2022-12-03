const express = require('express');
const router = express.Router()
const { getQr, getCalendarEventById,
    getCalendarEventsByOwner, addCalendarEvent } = require('../controllers/web')

router.use('/qr', getQr)
router
    .route('/calendar/event/:id')
    .get(getCalendarEventById)

router
    .route('/calendar/events/:id')
    .get(getCalendarEventsByOwner)

router
    .route('/calendar/event')
    .post(addCalendarEvent)

module.exports = router