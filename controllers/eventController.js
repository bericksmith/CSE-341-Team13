const { ObjectId } = require('mongodb');

// Get all Events
exports.getEvents = async (req, res) => {
    /*
        #swagger.tags=['Events']
        #swagger.summary = 'GET all events'
        #swagger.description = 'This endpoint returns a list of all events.'
    */
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
    /*
        #swagger.tags=['Events']
        #swagger.summary = 'GET an event by ID'
        #swagger.description = 'This endpoint returns a single event based on the provided ID.'
        #swagger.parameters['id'] = { description: 'Event ID', required: true }
    */
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
    /*
        #swagger.tags=['Events']
        #swagger.summary = 'CREATE a new event (OAuth required)'
        #swagger.description = 'This endpoint creates a new event with the provided details.'
        #swagger.parameters['body'] = { 
            in: 'body',
            description: 'Event data',
            required: true,
            schema: {
                $name: 'Fun Event',
                $location: 'Where',
                $date: '2024-10-29',
                $time: '08:00 PM',
                $venue: 'Facility Name'
            }
        }
        #swagger.security = [{ "OAuth2": [] }]
    */
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

// Update an event by ID
exports.updateEvent = async (req, res) => {
     /*
        #swagger.tags=['Events']
        #swagger.summary = 'UPDATE an event by ID (OAuth required)'
        #swagger.description = 'This endpoint updates an event based on the provided ID and data.'
        #swagger.parameters['id'] = { 
            description: 'Event ID',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Updated event data',
            schema: {
                name: 'Fun Event',
                location: 'Where',
                date: 'YYYY-MM-DD',
                time: 'hh:mm AM/PM (12-hour format)',
                venue: 'Name of Facility'
            } 
        }
        #swagger.security = [{ "OAuth2": [] }]
    */
    const db = req.app.locals.db;
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
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

// Delete an event by ID
exports.deleteEvent = async (req, res) => {
     /*
        #swagger.tags=['Events']
        #swagger.summary = 'DELETE an event by ID (OAuth required)'
        #swagger.description = 'This endpoint deletes an event based on the provided ID.'
        #swagger.parameters['id'] = { description: 'Event ID', required: true }
        #swagger.security = [{ "OAuth2": [] }]
    */
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
