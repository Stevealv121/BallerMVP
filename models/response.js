const { mongoose } = require('mongoose');
const { Schema } = mongoose;

const buttonsScheme = new Schema({
    body: String
});

const actionsSchema = new Schema({
    title: String,
    message: String,
    footer: String,
    buttons: [buttonsScheme],
});

//const Action = mongoose.model('Action', actionsSchema);

const responseScheme = new Schema({
    _id: {
        type: mongoose.Types.ObjectId
    },
    key: {
        type: String,
        required: true
    },
    replyMessage: {
        type: String,
        required: true
    },
    trigger: Boolean,
    media: Boolean,
    actions: actionsSchema
});

const Response = mongoose.model('response', responseScheme, 'response');

module.exports = Response;