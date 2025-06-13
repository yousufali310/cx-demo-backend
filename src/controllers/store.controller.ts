import { Request, ResponseToolkit } from '@hapi/hapi';
import { StoreService } from '../services/store.service';

const storeService = new StoreService();

export const storeController = {
  /**
   * @swagger
   * /api/stores:
   *   get:
   *     tags:
   *       - Stores
   *     description: Get list of stores with filtering and sorting
   *     parameters:
   *       - name: city
   *         in: query
   *         type: string
   *       - name: zip_code
   *         in: query
   *         type: string
   *       - name: staff_count_gt
   *         in: query
   *         type: number
   *       - name: staff_count_lt
   *         in: query
   *         type: number
   *       - name: staff_count_eq
   *         in: query
   *         type: number
   *       - name: sort_field
   *         in: query
   *         type: string
   *       - name: sort_order
   *         in: query
   *         type: string
   *         enum: [asc, desc]
   *       - name: page
   *         in: query
   *         type: number
   *       - name: limit
   *         in: query
   *         type: number
   *     responses:
   *       200:
   *         description: List of stores
   */
  getStores: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { query } = request;
        
        const filter = {
          city: query.city,
          zip_code: query.zip_code,
          staff_count: {
            gt: query.staff_count_gt ? Number(query.staff_count_gt) : undefined,
            lt: query.staff_count_lt ? Number(query.staff_count_lt) : undefined,
            eq: query.staff_count_eq ? Number(query.staff_count_eq) : undefined
          }
        };

        const sort = query.sort_field ? {
          field: query.sort_field,
          order: query.sort_order || 'asc'
        } : undefined;

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        const result = await storeService.getStores(filter, sort);
        return h.response(result).code(200);
      } catch (error) {
        console.error('Error in getStores:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching stores.'
        }).code(500);
      }
    }
  },

  /**
   * @swagger
   * /api/stores/{id}:
   *   get:
   *     tags:
   *       - Stores
   *     description: Get store details by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: number
   *     responses:
   *       200:
   *         description: Store details
   *       404:
   *         description: Store not found
   */
  getStoreById: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const id = Number(request.params.id);
        const store = await storeService.getStoreById(id);
        
        if (!store) {
          return h.response({ message: 'Store not found' }).code(404);
        }
        
        return h.response(store).code(200);
      } catch (error) {
        console.error('Error in getStoreById:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching the store.'
        }).code(500);
      }
    }
  },

  /**
   * @swagger
   * /api/stores/{id}/staff:
   *   get:
   *     tags:
   *       - Stores
   *     description: Get store staff with pagination
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: number
   *       - name: page
   *         in: query
   *         type: number
   *       - name: limit
   *         in: query
   *         type: number
   *     responses:
   *       200:
   *         description: List of store staff
   *       404:
   *         description: Store not found
   */
  getStoreStaff: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const id = Number(request.params.id);
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;

        const result = await storeService.getStoreStaff(id, page, limit);
        return h.response(result).code(200);
      } catch (error) {
        console.error('Error in getStoreStaff:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching store staff.'
        }).code(500);
      }
    }
  },

  /**
   * @swagger
   * /api/stores/{id}/rentals:
   *   get:
   *     tags:
   *       - Stores
   *     description: Get store rentals with pagination
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: number
   *       - name: page
   *         in: query
   *         type: number
   *       - name: limit
   *         in: query
   *         type: number
   *     responses:
   *       200:
   *         description: List of store rentals
   *       404:
   *         description: Store not found
   */
  getStoreRentals: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const id = Number(request.params.id);
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;

        const result = await storeService.getStoreRentals(id, page, limit);
        return h.response(result).code(200);
      } catch (error) {
        console.error('Error in getStoreRentals:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching store rentals.'
        }).code(500);
      }
    }
  }
}; 