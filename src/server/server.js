const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const { loadGraphModel } = require('@tensorflow/tfjs-node');
const loadmodel = require('../services/loadmodel');
require('dotenv').config();
const InputError = require('../exception/InputError');

(async () => {
    const port = process.env.PORT || 8080;
    const server = Hapi.server({
        port: port,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            },
        },
    });

    server.route(routes);

    const model = await loadmodel();
    server.app.model = model;
    if (!server.app.model) {
        console.error('Model tidak tersedia. Pastikan proses pemuatan model berhasil.');
    }

    // Custom error handling for 413 and other errors
    server.ext('onPreResponse', (request, h) => {
        const response = request.response;
    
        // Handle custom InputError
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
    
        // Handle Boom errors
        if (response.isBoom) {
            const statusCode = Number.isInteger(response.output.statusCode)
                ? response.output.statusCode
                : 400;
    
            // Check for 413 error and set a specific response
            if (statusCode === 413) {
                const newResponse = h.response({
                    status: 'fail',
                    message: `Payload content length greater than maximum allowed: 1000000`
                });
                newResponse.code(413);
                return newResponse;
            }
    
            // Default error handling for other Boom errors
            const newResponse = h.response({
                status: 'fail',
                message: `Terjadi kesalahan dalam melakukan prediksi`,
            });
            newResponse.code(statusCode);
            return newResponse;
        }
    
        return h.continue;
    });
    

    await server.start();
    console.log(`server running on ${server.info.uri}`);
})();
