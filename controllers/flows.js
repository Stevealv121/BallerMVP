const { get, reply, getIA } = require('../adapter')
const { saveExternalFile, checkIsUrl } = require('./handle')
const { insertEvent, event } = require('../adapter/calendar')

const getMessages = async (message) => {
    const data = await get(message)
    //Just for now, testing calendar integration
    //TODO: Remove this later, but it worked!!
    // insertEvent(event).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // });
    //console.log('data', data);
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