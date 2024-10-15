const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Final Project API CSE 341',
        description: 'Final Project API for managing events'
    },
    host: 'cse-341-team13.onrender.com',
    schemes: ['https'],
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
    }
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
