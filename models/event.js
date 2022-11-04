class Event {
    summary;
    description;
    start;
    end;
    constructor(summary, description, start, end) {
        this.summary = summary;
        this.description = description;
        this.start = start;
        this.end = end;
    }
}

module.exports = Event;