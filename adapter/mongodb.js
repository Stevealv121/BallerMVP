const mongoose = require("mongoose");
const Initial = require('../models/initial');
const Response = require('../models/response');

getResponse = async (step = '') => {
    //console.log('step', step);
    const response = await Response.findOne({ key: step });
    if (response === null) {
        const default_response = await Response.findOne({ key: 'DEFAULT' });
        return default_response
    }

    return response
}

getStep = async (message = '') => {
    //console.log('message', message);
    const initial = await Initial.findOne({ keywords: message });
    const step = initial?.key || null;

    return step
}

createStep = async (step = '', message = '') => {
    var id = new mongoose.Types.ObjectId();
    const initial = new Initial({
        _id: id,
        key: step,
        keywords: message
    });
    initial.save();
}

createResponse = async (step = '', message = '') => {
    var id = new mongoose.Types.ObjectId();
    const response = new Response({
        _id: id,
        key: step,
        replyMessage: message
    });
    response.save();
}

module.exports = {
    getResponse,
    getStep,
    createStep,
    createResponse
}

