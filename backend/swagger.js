const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'Places Near Me API',
        description: 'Api for storing rooms and data for the Places Near Me mobile and web application'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const outputFile = 'swagger.json'
const endpointsFiles = ["./routes/index.js"]

swaggerAutogen(outputFile, endpointsFiles, doc)