import { Request, ResponseToolkit } from '@hapi/hapi';
import { ActorService } from '../services/actor.service';

const actorService = new ActorService();

export const actorController = {
  getActors: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const actors = await actorService.getActors();
        return h.response(actors).code(200);
      } catch (error) {
        console.error('Error in getActors controller:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching actors.'
        }).code(500);
      }
    }
  }
}; 