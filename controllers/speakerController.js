const { ObjectId } = require('mongodb');

// Get all Speakers
exports.getSpeakers = async (req, res) => {
    /*
        #swagger.tags=['Speakers']
        #swagger.summary = 'GET all speakers'
        #swagger.description = 'This endpoint returns a list of all speakers.'
    */
    const db = req.app.locals.db;

    try {
        const events = await db.collection('speakers').find().toArray();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching speakers:', error);
        res.status(500).json({ message: 'An error occurred while fetching speakers', error });
    }
};

exports.getSingleSpeaker = async (req, res) => {
    /*
    #swagger.tags=['Speakers']
    #swagger.summary='GET a speaker by ID'
    #swagger.description= 'Gets a single speaker given the id'
    */

    /*
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the speaker to retrieve',
        required: true,
        type: 'string',
        example: '6500002e6f1a2b6d9c5e790a'
      }
    */

    const db = req.app.locals.db;

    // id validation
    let speakerId = req.params.id;
    if (!ObjectId.isValid(speakerId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    speakerId = new ObjectId(speakerId);

    try {
        const result = await db.collection('speakers').findOne({ _id: speakerId });
        // console.log(result);
        if (!result) {
            return res.status(404).json({ error: 'Speaker not found' });
        }

        // res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);

    } catch (error) {
        console.error('Database Error getting single speaker: ', error);
        // res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Server Error' });
    }
}

exports.createSpeaker = async (req, res) => {
    /*
    #swagger.tags=['Speakers']
    #swagger.summary='CREATE a speaker (OAuth required)'    
    #swagger.description= 'Creates a new speaker given the required data.<br>
        Requires the following fields: name, bio, photo_url, email, event, specialization, availability, location.<br> 
        Returns an object containing the id created.'
    */

    /*
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'Speaker data to be created',
         required: true,
         '@schema': { 
             required: ['name', 'bio', 'photo_url', 'email', 'event', 'specialization', 'availability', 'location'], 
             properties: { 
                name: { 
                    type: 'string', 
                    example: 'Marcela Santana' 
                },
                bio: {
                    type: 'string',
                    example: 'Marcela is a renowned nutritionist with over 10 years of experience promoting healthy lifestyles.'
                },
                photo_url: {
                    type: 'string',
                    format: 'url',
                    example: 'https://example.com/marce.jpg'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    example: 'marcela@example.com'
                },
                event: {
                   type: 'string',
                   example: '670de14cd436d85952af4c3f' 
                },
                specialization: {
                    type: 'string',
                    example: 'Sports Nutrition'
                },
                availability: {
                    type: 'boolean',
                    example: true
                },
                location: {
                    type: 'string',
                    example: 'Austin, TX'
                }
            } 
        } 
    }
 */

    /*
    #swagger.security = [{
       'OAuth2': ['write']
        }] 
    */

    const db = req.app.locals.db;
    const { name, bio, photo_url, email, event, specialization, availability, location } = req.body;
    const speaker = { name, bio, photo_url, email, event, specialization, availability, location };

    try {
        const response = await db.collection('speakers').insertOne(speaker);
        if (response.insertedId) {
            res.status(201).json({ _id: response.insertedId });
        }
        else {
            res.status(500).json({ error: 'Failed to create the speaker' });
        }
    } catch (error) {
        console.error('Error creating speaker: ', error);
        res.status(500).json({ error: error.message || 'Some error ocurred while creating the speaker' });

    }
}


exports.updateSpeaker = async (req, res) => {
    /*
    #swagger.tags=['Speakers']
    #swagger.summary='UPDATE a speaker by ID (OAuth required)'
    
    #swagger.description= 'Updates the speaker info given the id.'
    */

    /*
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the speaker to be updated',
        required: true,
        type: 'string',
        example: '6500002e6f1a2b6d9c5e790a'
      }
    */

    /*
       #swagger.parameters['body'] = {
           in: 'body',
           description: 'Speaker data to be updated',
           '@schema': {     
               properties: { 
                  name: { 
                      type: 'string', 
                      example: 'Marcela Santana' 
                  },
                  bio: {
                      type: 'string',
                      example: 'Marcela is a renowned nutritionist with over 10 years of experience promoting healthy lifestyles.'
                  },
                  photo_url: {
                      type: 'string',
                      format: 'url',
                      example: 'https://example.com/marce.jpg'
                  },
                  email: {
                      type: 'string',
                      format: 'email',
                      example: 'marcela@example.com'
                  },
                  event: {
                     type: 'string',
                     example: '670de14cd436d85952af4c3f' 
                  },
                  specialization: {
                      type: 'string',
                      example: 'Sports Nutrition'
                  },
                  availability: {
                      type: 'boolean',
                      example: true
                  },
                  location: {
                      type: 'string',
                      example: 'Austin, TX'
                  }
              } 
          } 
      }
   */

    /*
    #swagger.security = [{
       'OAuth2': ['write']
        }] 
    */

    const db = req.app.locals.db;

    // id validation
    let speakerId = req.params.id;
    if (!ObjectId.isValid(speakerId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    speakerId = new ObjectId(speakerId);

    // creating a valid object with right keys
    const speaker = {};
    const validFields = ['name', 'bio', 'photo_url', 'email', 'event', 'specialization', 'availability', 'location'];
    const body = req.body;
    for (let field of validFields) {
        if (body[field] !== undefined) {
            speaker[field] = body[field];
        }
    }


    try {
        const response = await db.collection('speakers').updateOne({ _id: speakerId }, { $set: speaker });

        if (response.modifiedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: 'speaker not found or no changes made' });
        }
    } catch (error) {
        console.log('Error updating the speaker: ', error);
        res.status(500).json({ error: error.message || 'Some error ocurred while updating the speaker' });
    }
}




exports.deleteSpeaker = async (req, res) => {
    /*
     #swagger.tags=['Speakers']
     #swagger.summary="DELETE a speaker by ID (OAuth required)"    
     #swagger.description= "Deletes the speaker info given the id."
    */

    /*
        #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the speaker to delete', 
        required: true,
        type: 'string',
        example: '6500002e6f1a2b6d9c5e790a'
        }
    */

   /*
    #swagger.security = [{
       'OAuth2': ['write']
        }] 
    */

    const db = req.app.locals.db;

    // id validation
    let speakerId = req.params.id;
    if (!ObjectId.isValid(speakerId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    speakerId = new ObjectId(speakerId);   

    try {
        const response = await db.collection("speakers").deleteOne({ _id: speakerId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        }
        else {
            // console.log("Error deleting speaker: ", response);
            res.status(500).json({ error: "Failed deleting speaker" });
        }
    } catch (error) {
        console.log("Error executing query to delete speaker: ", error);
        res.status(500).json({ error: error.message || "Some error ocurred while deleting the speaker" });

    }
}