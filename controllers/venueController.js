const { ObjectId } = require('mongodb');

// Get all Venues
exports.getVenues = async (req, res) => {
    /* 
      #swagger.tags = ['Venues']
      #swagger.summary = 'GET all Venues'
      #swagger.description = 'This endpoint returns a list of all Venues.'
    */
    const db = req.app.locals.db;

    try {
        const venue = await db.collection('venues').find().toArray();
        res.status(200).json(venue);
    } catch (error) {
        console.error("Error fetching venues:", error);
        res.status(500).json({ message: 'An error occurred while fetching venues', error });
    }
};

// Get a venue by ID
exports.getVenueById = async (req, res) => {
    /* 
      #swagger.tags = ['Venues']
      #swagger.summary = 'GET a venue by ID'
      #swagger.description = 'This endpoint returns a single venue based on the provided ID.'
      #swagger.parameters['id'] = { description: 'venue ID', required: true }
    */
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid venue ID format' });
        }

        const venue = await db.collection('venues').findOne({ _id: new ObjectId(id) });
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(venue);
    } catch (error) {
        console.error("Error fetching venue by ID:", error);
        res.status(500).json({ message: 'An error occurred while fetching the venue', error });
    }
};

// Create a new Venue
exports.createVenue = async (req, res) => {
    /* 
      #swagger.tags = ['Venues']
      #swagger.summary = 'CREATE a new venue (OAuth required)'
      #swagger.description = 'This endpoint creates a new venue with the provided details.'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Venue data',
            required: true,
            schema: {
              $name: '',
              $address: '',
              $city: '',
              $state: '',
              $postal: '',
              $capacity: '',
              $created_at: ''
            }
        }
      #swagger.security = [{ "OAuth2": [] }]
    */

    const db = req.app.locals.db;
    const { name, address, city, state, postal, capacity } = req.body;
    const created_at = new Date();
    try {
        
        const newVenue = {
            name,
            address,
            city,
            state,
            postal,
            capacity,
            created_at
        };

        await db.collection('venues').insertOne(newVenue);
        res.status(201).json(newVenue);
    } catch (error) {
        console.error("Error creating a venue:", error);
        res.status(500).json({ message: 'An error occurred while creating the venue', error });
    }
};

// Update a venue by ID
exports.updateVenue = async (req, res) => {
    /* 
      #swagger.tags = ['Venues']
      #swagger.summary = 'UPDATE a venue by ID (OAuth required)'
      #swagger.description = 'This endpoint updates a venue based on the provided ID and data.'
      #swagger.parameters['id'] = { description: 'Venue ID', required: true }
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Updated venue data',
            schema: {
              name,
              address,
              city,
              state,
              postal,
              capacity,
            }
        }
      #swagger.security = [{ "OAuth2": [] }]
    */
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    const db = req.app.locals.db;
    const { id } = req.params;
    const updateVenue = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid venue ID format' });
        }


        const result = await db.collection('venues').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateVenue }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.status(200).json({ message: 'Venue updated successfully' });
    } catch (error) {
        console.error("Error updating venue by ID:", error);
        res.status(500).json({ message: 'An error occurred while updating the venue', error });
    }
};

// Delete a venue by ID
exports.deleteVenue = async (req, res) => {
    /* 
      #swagger.tags = ['Venues']
      #swagger.summary = 'DELETE a venue by ID (OAuth required)'
      #swagger.description = 'This endpoint deletes a venue based on the provided ID.'
      #swagger.parameters['id'] = { description: 'Venue ID', required: true }
      #swagger.security = [{ "OAuth2": [] }]
    */
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid venue ID format' });
        }

        const result = await db.collection('venues').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        console.error("Error deleting venue by ID:", error);
        res.status(500).json({ message: 'An error occurred while deleting the venue', error });
    }
};
