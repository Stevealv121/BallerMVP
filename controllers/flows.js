const { get, reply, getIA } = require('../adapter')
const { saveExternalFile, checkIsUrl } = require('./handle')
const { insertEvent, event } = require('../adapter/calendar');
const { handleReservation } = require('./reservation');

const getMessages = async (message) => {
    let data = 'DEFAULT';
    console.log('message', message);
    if (!isNaN(+message)) {
        console.log('Entering handle reservation');
        await handleReservation(+message);
        data = 'HOUR';
    } else {
        console.log('Entering normal flow');
        data = await get(message)
    }

    return data
}

const responseMessages = async (step) => {
    const data = await reply(step)
    if (data && data.media) {
        const file = checkIsUrl(data.media) ? await saveExternalFile(data.media) : data.media;
        return { ...data, ...{ media: file } }
    }
    //console.log('dataresponse', data);
    return data
}

const bothResponse = async (message) => {
    const data = await getIA(message)
    if (data && data.media) {
        const file = await saveExternalFile(data.media)
        return { ...data, ...{ media: file } }
    }
    return data
}


module.exports = { getMessages, responseMessages, bothResponse }