const fs = require('fs')
const { sendMessage } = require('../controllers/send')
const Calendar = require('../models/calendar')
const mongoose = require('mongoose')

const sendMessagePost = (req, res) => {
    console.log('asdasdasdasdasd')
    const { message, number } = req.body
    const client = req.clientWs || null;
    sendMessage(client, number, message)
    res.send({ status: 'Enviado!' })
}

const getQr = (req, res) => {
    res.writeHead(200, { 'content-type': 'image/svg+xml' });
    fs.createReadStream(`${__dirname}/../mediaSend/qr-code.svg`).pipe(res);
}

const getCalendarEventById = async (req, res) => {
    const id = req.params.id;
    const event = await Calendar.findOne({ owner_id: id });
    res.send(event);
}

const getCalendarEventsByOwner = async (req, res) => {
    const owner_id = req.params.id;
    const events = await Calendar.find({ owner_id });
    res.send(events);
}

const addCalendarEvent = async (req, res) => {
    const { title, start, end, allDay, owner_id, } = req.body;
    var _id = new mongoose.Types.ObjectId();
    const event = new Calendar({
        _id: _id,
        title: title,
        start: start,
        end: end,
        allDay: allDay,
        owner_id: owner_id,
    });
    event.save(function (err) {
        if (err) {
            return res.status(500).json({ 'message': `Error occurred: ${err}` });
        } else {
            return res.json({ 'message': 'Event created!' });
        };
    });
}

const editCalendarEvent = async (req, res) => {
    const { title, start, end, allDay, owner_id, _id } = req.body;
    var objectID = new mongoose.Types.ObjectId(_id);
    await Calendar.findOneAndUpdate({ _id: objectID }, {
        title: title,
        start: start,
        end: end,
        allDay: allDay,
        owner_id: owner_id,
    }, {
        returnOriginal: false
    });
    res.status(200).json({ 'message': 'Event edited!' });
}


module.exports = {
    sendMessagePost, getQr,
    getCalendarEventById, getCalendarEventsByOwner,
    addCalendarEvent, editCalendarEvent
}