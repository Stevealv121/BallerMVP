require('dotenv').config()
const fs = require('fs');
const express = require('express');
const cors = require('cors')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { middlewareClient } = require('./middleware/client')
const { generateImage, cleanNumber, checkEnvFile, createClient, isValidNumber } = require('./controllers/handle')
const { connectionReady, connectionLost } = require('./controllers/connection')
const { saveMedia } = require('./controllers/save')
const { getMessages, responseMessages, bothResponse } = require('./controllers/flows')
const { sendMedia, sendMessage, sendMessageButton, readChat } = require('./controllers/send')
const { mongoose } = require('mongoose');
const ConnectDB = require('./config/mongodb.js');

const app = express();
app.use(cors())
app.use(express.json())
const MULTI_DEVICE = process.env.MULTI_DEVICE || 'true';
const server = require('http').Server(app)

const port = process.env.PORT || 3000
//var client;
app.use('/', require('./routes/web'))

const listenMessage = () => client.on('message', async msg => {
    const { from, body, hasMedia } = msg;

    if (!isValidNumber(from)) {
        return
    }

    // Este bug lo reporto Lucas Aldeco Brescia para evitar que se publiquen estados
    if (from === 'status@broadcast') {
        return
    }
    message = body.toLowerCase();
    console.log('BODY', message)
    const number = cleanNumber(from)
    await readChat(number, message)

    /**
     * Guardamos el archivo multimedia que envia
     */
    if (process.env.SAVE_MEDIA && hasMedia) {
        const media = await msg.downloadMedia();
        saveMedia(media);
    }

    /**
     * Si estas usando dialogflow solo manejamos una funcion todo es IA
     */

    if (process.env.DATABASE === 'dialogflow') {
        if (!message.length) return;
        const response = await bothResponse(message);
        await sendMessage(client, from, response.replyMessage);
        if (response.media) {
            sendMedia(client, from, response.media);
        }
        return
    }

    /**
    * Ver si viene de un paso anterior
    * Aqui podemos ir agregando más pasos
    * a tu gusto!
    */

    // const lastStep = await lastTrigger(from) || null;
    // if (lastStep) {
    //     const response = await responseMessages(lastStep)
    //     await sendMessage(client, from, response.replyMessage);
    // }

    /**
     * Respondemos al primero paso si encuentra palabras clave
     */
    const step = await getMessages(message);

    if (step) {
        const response = await responseMessages(step);
        console.log('response', response);

        /**
         * Si quieres enviar botones
         */

        /*
        * Este es el original
        */
        //await sendMessage(client, from, response.replyMessage, response.trigger);

        /**
         * Modificado para que envia un simple dato, para probar mongo
         */
        //await sendMessage(client, from, response, null);

        /**
         * Original
         */
        // if (response.hasOwnProperty('actions')) {
        //     const { actions } = response;
        //     await sendMessageButton(client, from, null, actions);
        //     return
        // }

        /**
         * Test Mongo Botones
         *  */
        if (true) {
            const { actions } = response;
            //console.log('actions', actions)
            await sendMessageButton(client, from, null, actions);
            return
        }


        if (!response.delay && response.media) {
            sendMedia(client, from, response.media);
        }
        if (response.delay && response.media) {
            setTimeout(() => {
                sendMedia(client, from, response.media);
            }, response.delay)
        }
        return
    }

    //Si quieres tener un mensaje por defecto
    if (process.env.DEFAULT_MESSAGE === 'true') {
        const response = await responseMessages('DEFAULT')
        await sendMessage(client, from, response.replyMessage, response.trigger);

        /**
         * Si quieres enviar botones
         */
        if (response.hasOwnProperty('actions')) {
            const { actions } = response;
            await sendMessageButton(client, from, null, actions);
        }
        return
    }
});

ConnectDB.mongoConnection();
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', qr => generateImage(qr, () => {
    qrcode.generate(qr, { small: true });
    console.log(`Ver QR http://localhost:${port}/qr`)
    socketEvents.sendQR(qr)
}))

client.on('ready', (a) => {
    connectionReady()
    listenMessage()
    // socketEvents.sendStatus(client)
});

// client.on('message', message => {
//     console.log(message.body);
// });

client.on('auth_failure', (e) => {
    // console.log(e)
    // connectionLost()
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.initialize();

server.listen(port, () => {
    console.log(`Server running on ${port}`);
})

checkEnvFile();
