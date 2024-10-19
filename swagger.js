const swaggerAutogen = require('swagger-autogen')();

/*
    Set the 'environment' variable to 'dev' for local development
    or 'prod' for deployment on Render.
*/
const environment = 'prod'; 


let host = '';
let protocol = '';
let schemes = [];

if (environment === 'prod') {
    host = 'cse-341-team13.onrender.com';
    protocol = 'https';
    schemes = ['https'];
    console.log('Running in production mode');
  } else {
    host = 'localhost:5000';
    protocol = 'http';
    schemes = ['http'];
    console.log('Running in development mode');
  }

const doc = {
    host: host,
    schemes: schemes,
    info: {
        title: 'Event Management System API - CSE 341',
        // description: 'Team 13 Final Project - API for managing events\n\nContributors:\n- Berick Smith\n- Lenora Stevens\n- Ramon Felipe Castano\n- Livia Costa Lira de Medeiros'       
        description: 'Team 13 Final Project - API for managing events\n\n' + 
        '**Contributors**:\n- Berick Smith\n- Lenora Stevens\n- Ramon Felipe Castano\n- Livia Costa Lira de Medeiros\n\n' + 
        'This API provides various endpoints for accessing resources. \n\n' + 
        '**Authentication Required**: Endpoints marked with a padlock icon are restricted and can only be accessed after logging in via GitHub using OAuth. \n\n' + 
        '**OAuth Login:** Authentication is handled via GitHub OAuth. To connect, use the following endpoints:\n\n' + 
        '- **Login**: ' + protocol + '://' + host + '/github' + ' - Initiates the OAuth process with GitHub. \n' + 
        '- **Logout**: ' + protocol + '://' + host + '/logout' + ' - Ends your session.',

    },    
    securityDefinitions: {
        OAuth2: {
            type: 'oauth2',
            flow: 'accessCode',
            authorizationUrl: 'https://github.com/login/oauth/authorize',
            tokenUrl: 'https://github.com/login/oauth/access_token',
            scopes: {
                'read': 'Grants read access',
                'write': 'Grants write access'
            }
        }
    },
    definitions: {
        User: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: 'User ID' },
                fname: { type: 'string', description: 'First name' },
                lname: { type: 'string', description: 'Last name' },
                email: { type: 'string', description: 'Email address' },
                dob: { type: 'string', format: 'date', description: 'Date of Birth' },
                location: { type: 'string', description: 'Location' },
                role: { type: 'string', description: 'User role' },
                status: { type: 'string', description: 'Account status' }
            }
        },
        Event: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: 'Event ID' },
                name: { type: 'string', description: 'Event name' },
                description: { type: 'string', description: 'Event description' },
                date: { type: 'string', format: 'date-time', description: 'Event date' },
                location: { type: 'string', description: 'Event location' },
                type: { type: 'string', description: 'Event type (conference, concert)' }
            }
        },
        Ticket: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: 'Ticket ID' },
                event_id: { type: 'string', description: 'ID of the associated event' },
                user_id: { type: 'string', description: 'ID of the associated user' },
                ticket_number: { type: 'string', description: 'Unique ticket number' },
                price: { type: 'number', description: 'Ticket price' },
                date: { type: 'string', format: 'date-time', description: 'Date of ticket creation or purchase' },
                status: { type: 'string', description: 'Ticket status (active, cancelled)' }
            }
        },        
        Speakers: {
            type: 'object',
            properties: {
            }
        },        
        Venues: {
            type: 'object',
            properties: {
            }
        }
    }
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
