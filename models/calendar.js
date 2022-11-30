const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: { type: String, required: true },
    start: { type: mongoose.Schema.Types.Date, required: true },
    end: { type: mongoose.Schema.Types.Date, required: true },
    allDay: { type: Boolean, required: true },
    owner_id: { type: Number, required: true },
    id: { type: String, required: true },
});

const Calendar = mongoose.model("calendar", calendarSchema, "calendar");

module.exports = Calendar;