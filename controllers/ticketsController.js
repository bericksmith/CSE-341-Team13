const { ObjectId } = require('mongodb');

// Get all tickets
exports.getTickets = async (req, res) => {
    //#swagger.tags=['Tickets']
    const db = req.app.locals.db;

    try {
        const tickets = await db.collection('tickets').find().toArray();
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: 'An error occurred while fetching tickets', error });
    }
};

// Get a ticket by ID
exports.getTicketById = async (req, res) => {
    //#swagger.tags=['Tickets']
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ticket ID format' });
        }

        const ticket = await db.collection('tickets').findOne({ _id: new ObjectId(id) });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        res.status(500).json({ message: 'An error occurred while fetching the ticket', error });
    }
};

// Create a new ticket
exports.createTicket = async (req, res) => {
    //#swagger.tags=['Tickets']
    const db = req.app.locals.db;
    const { event_id, user_id, ticket_number, price, date, status } = req.body;

    try {
        const newTicket = {
            event_id: new ObjectId(event_id),
            user_id: new ObjectId(user_id),
            ticket_number,
            price,
            date: new Date(date),
            status
        };

        await db.collection('tickets').insertOne(newTicket);
        res.status(201).json(newTicket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: 'An error occurred while creating the ticket', error });
    }
};

// Update a ticket by ID
exports.updateTicket = async (req, res) => {
    //#swagger.tags=['Tickets']
    const db = req.app.locals.db;
    const { id } = req.params;
    const updateData = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ticket ID format' });
        }

        const result = await db.collection('tickets').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket updated successfully' });
    } catch (error) {
        console.error("Error updating ticket by ID:", error);
        res.status(500).json({ message: 'An error occurred while updating the ticket', error });
    }
};

// Delete a ticket by ID
exports.deleteTicket = async (req, res) => {
    //#swagger.tags=['Tickets']
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ticket ID format' });
        }

        const result = await db.collection('tickets').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error("Error deleting ticket by ID:", error);
        res.status(500).json({ message: 'An error occurred while deleting the ticket', error });
    }
};
