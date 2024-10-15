const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Final Project API CSE 341',
        description: 'Final Project API for managing events'
    },
    host: 'cse-341-team13.onrender.com',
    schemes: ['https'],
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
