const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/equipment.routes.js']

swaggerAutogen(outputFile, endpointsFiles)