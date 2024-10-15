const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Final Project API CSE 341',
        description: "API for managing users and products\n\nContributors:\n- Berick Smith\n- Lenora Stevens\n- Ramon Felipe Castano\n- Livia Costa Lira de Medeiros"       
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
