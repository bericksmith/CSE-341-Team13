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
                name: { type: 'string', description: 'Event name', example: 'Fall 10K' },
                location: { type: 'string', description: 'Event location', example: 'Georgetown' },
                date: { type: 'string', format: 'date-time', description: 'Event date', example: '2024-11-15' },
                time: { type: 'string', description: 'hh:mm AM/PM (12-hour format)', example: '08:00 AM' },
                venue: { type: 'string', description: 'Event Venue Name', example: 'Central Park Pavillion' }
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
        Speaker: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: 'Speaker ID' },
                name: { type: 'string', description: 'Full name of the speaker', example: 'Ana Maria Lopez' },
                bio: { type: 'string', description: 'Brief biography of the speaker', example: 'Ana Maria is a renowned nutritionist with over 10 years of experience promoting healthy lifestyles. She has participated in multiple conferences on health and sports.' },
                photo_url: { type: 'string', description: 'URL of the speaker\'s profile photo', example: 'https://example.com/ana_lopez.jpg' },
                email: { type: 'string', format: 'email', description: 'Email address of the speaker', example: 'ana.lopez@example.com' },
                event: { type: 'string', description: 'Event ID where the speaker is participating', example: '670de14cd436d85952af4c3f' },
                specialization: { type: 'string', description: 'Area of expertise or specialization of the speaker', example: 'Sports Nutrition' },
                availability: { type: 'boolean', description: 'Indicates if the speaker is available for the event', example: true },
                location: { type: 'string', description: 'Location of the speaker', example: 'Austin, TX' }
            }
        },                 
        Venues: {
            type: 'object',
            properties: {
                _id: { type: 'string', description: 'Venue ID' },
                name:{ type: 'string', description: 'Venue Name', example: 'Riverside Arena'},
                address: { type: 'string', description: 'Venue Street Address', example: '789 Riverside Drive' },
                city: {type: 'string', description: 'Venue City', example: 'New York'},
                state: {type: 'string', description: 'Venue State', example: 'NY'},
                postal: {type: 'string', description: 'Venue Zipcode', example: '10024'},
                capacity: {type: 'string', description: 'Venue Capacity', example: '3000'},
            }
        }
    }
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
