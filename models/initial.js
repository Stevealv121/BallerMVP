const { mongoose } = require('mongoose');
const { Schema } = mongoose;

const initialScheme = new Schema({
    _id: {
        type: mongoose.Types.ObjectId
    },
    key: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        required: true
    }
});

const Initial = mongoose.model('initial', initialScheme, 'initial');

module.exports = Initial;