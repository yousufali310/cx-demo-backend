import { Request, ResponseToolkit } from '@hapi/hapi';
import { FilmService } from '../services/film.service';

const filmService = new FilmService();

export const filmController = {
  getFilms: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { page = 1, limit = 10, filter } = request.query;
        
        // Parse filter if it's a string
        let parsedFilter = filter;
        if (typeof filter === 'string') {
          try {
            parsedFilter = JSON.parse(filter);
          } catch (e) {
            return h.response({ 
              error: 'Bad Request',
              message: 'Invalid filter format'
            }).code(400);
          }
        }

        const films = await filmService.getFilms(parsedFilter, page, limit);
        return h.response(films).code(200);
      } catch (error) {
        console.error('Error in getFilms:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching films'
        }).code(500);
      }
    }
  },

  getFilmById: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const id = Number(request.params.id);
        const film = await filmService.getFilmById(id);
        
        if (!film) {
          return h.response({ message: 'Film not found' }).code(404);
        }
        
        return h.response(film).code(200);
      } catch (error) {
        console.error('Error in getFilmById:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching the film'
        }).code(500);
      }
    }
  },

  getFilterOptions: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const filterOptions = await filmService.getFilterOptions();
        return h.response(filterOptions).code(200);
      } catch (error) {
        console.error('Error in getFilterOptions:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching filter options'
        }).code(500);
      }
    }
  }
}; 