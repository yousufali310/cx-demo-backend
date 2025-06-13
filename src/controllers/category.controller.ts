import { Request, ResponseToolkit } from '@hapi/hapi';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export const categoryController = {
  getCategories: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const categories = await categoryService.getCategories();
        return h.response(categories).code(200);
      } catch (error) {
        console.error('Error in getCategories controller:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching categories.'
        }).code(500);
      }
    }
  }
}; 