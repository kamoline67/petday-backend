const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PetDay - Sistema de Agendamento para PetShops',
            version: '1.0.0',
            description: 'API para agendamento de serviços de petshops, cadastro e login.',
            contact: {
                name: 'Suporte PetDay',
                email: 'petdaytec@gmail.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de local.'
            }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};