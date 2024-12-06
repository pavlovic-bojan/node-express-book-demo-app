const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_name
 *         - email
 *         - password
 *       properties:
 *         user_name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *         age:
 *           type: integer
 */

/**
 * Swagger documentation setup.
 * @param {Express.Application} app - The Express app instance
 */
const setupSwagger = (app) => {
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Book Demo App',
                version: '1.0.0',
                description: 'API documentation for this Book Demo Project in Express & Node',
            },
            servers: [
                {
                    url: '/api',
                },
            ],
            tags: [
                {
                    name: 'Users',
                    description: 'User related API operations'
                },
                {
                    name: 'Authors',
                    description: 'Author related API operations'
                },
                {
                    name: 'Books',
                    description: 'Book related API operations'
                }
            ],
        },
        apis: ['./src/api/routes/*.js'],
    }

    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    // Swagger UI endpoint
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

module.exports = { setupSwagger }
