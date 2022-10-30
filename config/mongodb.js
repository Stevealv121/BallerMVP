const { mongoose } = require('mongoose');

class ConnectDB {

    static async mongoConnection() {
        try {
            mongoose.connect(process.env.MONGODB_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = ConnectDB;