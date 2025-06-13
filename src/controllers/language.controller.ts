import { Request, ResponseToolkit } from '@hapi/hapi';
import { LanguageService } from '../services/language.service';

const languageService = new LanguageService();

export const languageController = {
  getLanguages: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const languages = await languageService.getLanguages();
        return h.response(languages).code(200);
      } catch (error) {
        console.error('Error in getLanguages controller:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching languages.'
        }).code(500);
      }
    }
  }
}; 