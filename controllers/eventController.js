const { ObjectId } = require('mongodb');

// Get all Events
exports.getEvents = async (req, res) => {
    //#swagger.tags=['Events']
    const db = req.app.locals.db;

    try {
        const events = await db.collection('events').find().toArray();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: 'An error occurred while fetching events', error });
    }
};

// Get a event by ID
exports.getEventById = async (req, res) => {
    //#swagger.tags=['Events']
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({ message: 'An error occurred while fetching the event', error });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    //#swagger.tags=['Events']
    const db = req.app.locals.db;
    const { name, location, date, time, venue } = req.body;

    try {
        const newEvent = {
            name,
            location,
            date: new Date(date),
            time,
            venue
        };

        await db.collection('events').insertOne(newEvent);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: 'An error occurred while creating the event', error });
    }
};

// Update a event by ID
exports.updateEvent = async (req, res) => {
    //#swagger.tags=['Events']
    const db = req.app.locals.db;
    const { id } = req.params;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const eventId = ObjectId.createFromHexString(req.params.id);

        const updateData = {
            $set: {
                name: req.body.name,
                location: req.body.location,
                date: req.body.date,
                time: req.body.time,
                venue: req.body.venue
            }
        };

        const result = await db.collection('events').updateOne(
            { _id: eventId }, updateData
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error("Error updating event by ID:", error);
        res.status(500).json({ message: 'An error occurred while updating the event', error });
    }
};

// Delete a event by ID
exports.deleteEvent = async (req, res) => {
    //#swagger.tags=['Events']
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error("Error deleting event by ID:", error);
        res.status(500).json({ message: 'An error occurred while deleting the event', error });
    }
};
