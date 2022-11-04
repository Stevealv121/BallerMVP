//const { getData, getReply, saveMessageMysql } = require('./mysql')
const { getResponse, getStep } = require('./mongodb')
const { saveMessageJson } = require('./jsonDb')
//const { getDataIa } = require('./diaglogflow')
const stepsInitial = require('../flow/initial.json')
const stepsReponse = require('../flow/response.json')

const get = (message) => new Promise((resolve, reject) => {
    /**
     * Si no estas usando un gesto de base de datos
     */

    if (process.env.DATABASE === 'none') {
        const { key } = stepsInitial.find(k => k.keywords.includes(message)) || { key: null }
        const response = key || null
        resolve(response)
    }

    /**
     * Si usas mongodb
     */
    if (process.env.DATABASE === 'mongodb') {
        getStep(message).then((dt) => {
            resolve(dt)
        });
    }

})


const reply = (step) => new Promise((resolve, reject) => {
    /**
    * Si no estas usando un gesto de base de datos
    */
    if (process.env.DATABASE === 'none') {
        let resData = { replyMessage: '', media: null, trigger: null }
        const responseFind = stepsReponse[step] || {};
        resData = {
            ...resData,
            ...responseFind,
            replyMessage: responseFind.replyMessage.join('')
        }
        resolve(resData);
        return
    }

    /**
     * Si usas mongodb
     *  
        */
    if (process.env.DATABASE === 'mongodb') {
        getResponse(step).then((dt) => {
            resolve(dt)
        });
    }

})

const getIA = (message) => new Promise((resolve, reject) => {
    /**
     * Si usas dialogflow
     */
    //  if (process.env.DATABASE === 'dialogflow') {
    //     let resData = { replyMessage: '', media: null, trigger: null }
    //     getDataIa(message,(dt) => {
    //         resData = { ...resData, ...dt }
    //         resolve(resData)
    //     })
    // }
})

/**
 * 
 * @param {*} message 
 * @param {*} date 
 * @param {*} trigger 
 * @param {*} number 
 * @returns 
 */
const saveMessage = (message, trigger, number) => new Promise(async (resolve, reject) => {
    switch (process.env.DATABASE) {
        case 'mysql':
            resolve(await saveMessageMysql(message, trigger, number))
            break;
        case 'none':
            resolve(await saveMessageJson(message, trigger, number))
            break;
        default:
            resolve(true)
            break;
    }
})

module.exports = { get, reply, getIA, saveMessage }