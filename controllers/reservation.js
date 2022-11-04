const { getEvents, dateTimeForCalendar, insertEvent, formatDate } = require('../adapter/calendar');
const { createStep, createResponse } = require('../adapter/mongodb');
const Event = require('../models/event');

const dateFormat = dateTimeForCalendar();
let replyMessage = "No hay campo disponibles para la hora seleccionada. Por favor, seleccione otra fecha.";

const checkEventsForToday = async () => {
    const events = await getEvents(dateFormat.start, dateFormat.end);

    if (events.length > 0) {
        let message = 'Estos son los eventos de hoy:\n';
        events.forEach((event) => {
            message += `*${event.summary}*\n`;
            message += `*Hora de inicio:* ${event.start.dateTime}\n`;
            message += `*Hora de finalización:* ${event.end.dateTime}\n`;
            message += `*Descripción:* ${event.description}\n\n`;
        });
        replyMessage = message;
        return false;
    } else {
        replyMessage = 'Por favor ingrese la hora deseada para la reserva.';
        return true;
    }
}

const bookEvent = async (time) => {
    //TODO:Format time to match Google Calendar format
    const formattedTime = formatDate(time);
    const newEvent = new Event('Reservacion Baller',
        'Reservacion de cancha de futbol',
        formattedTime.start, formattedTime.end);
    const result = await insertEvent(newEvent);
    if (result === 1) {
        //await createResponse("HOUR", "Reservacion exitosa");
        console.log('Reservacion exitosa');
    } else {
        console.log('Error al crear el evento');
    }
}


const handleReservation = async (time) => {

    const eventsFlag = await checkEventsForToday();
    if (eventsFlag) {
        console.log('ENtre,booking...');
        await bookEvent(time);
    } else {
        console.log('No se puede crear el evento');
    }

}

module.exports = { handleReservation };