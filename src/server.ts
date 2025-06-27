import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import { filmRoutes } from './routes/film.routes';
import { storeRoutes } from './routes/store.routes';
import { rentalRoutes } from './routes/rental.routes';
import dotenv from 'dotenv';

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: '0.0.0.0',
    routes: {
      cors: true
    }
  });

  const swaggerOptions = {
    info: {
      title: 'Film Rental API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Film Rental System',

    },
    grouping: 'tags',
    sortEndpoints: 'ordered',
    documentationPath: '/documentation',
    // swaggerUIPath: '/swaggerui/',
    // jsonPath: '/swagger.json',
    tags: [
      {
        name: 'films',
        description: 'Film management operations'
      },
      {
        name: 'stores',
        description: 'Store management operations'
      },
      {
        name: 'rentals',
        description: 'Rental management operations'
      },

    ],

  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  // Register routes
  server.route([
    ...filmRoutes,
    ...storeRoutes,
    ...rentalRoutes
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
  console.log('Documentation available at: %s/documentation', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
