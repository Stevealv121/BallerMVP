const { mongoose } = require('mongoose');
const Initial = require('../models/initial');
const Response = require('../models/response');

getResponse = async (step = '') => {
    //console.log('step', step);
    const response = await Response.findOne({ key: step });
    if (response === null) {
        const default_response = await Response.findOne({ key: 'DEFAULT' });
        return default_response
    }
    //const reply = response?.replyMessage || null;
    //console.log('reply', reply);
    //callback(reply);
    //console.log('response', response);
    //console.log('buttonOne', response?.actions?.buttons[0]);
    return response
}

getStep = async (message = '') => {
    //console.log('message', message);
    const initial = await Initial.findOne({ keywords: message });
    const step = initial?.key || null;
    //console.log('step', step);
    //callback(step)

    return step
}

module.exports = {
    getResponse,
    getStep
}

