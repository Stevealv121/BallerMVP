const express = require('express');
const router = express.Router()
const { getQr, getCalendarEventById,
    getCalendarEventsByOwner, addCalendarEvent, editCalendarEvent, deleteCalendarEvent } = require('../controllers/web')

router.use('/qr', getQr)

router
    .route('/calendar/events/:id')
    .get(getCalendarEventsByOwner)

router
    .route('/calendar/event')
    .post(addCalendarEvent)
    .put(editCalendarEvent)

router
    .route('/calendar/event/:id')
    .delete(deleteCalendarEvent)

module.exports = router