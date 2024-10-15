const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Final Project API CSE 341',
        description: 'Final Project API for managing users and events'
    },
    host: 'localhost:5000',
    schemes: ['http'],
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
