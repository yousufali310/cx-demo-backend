import { Request, ResponseToolkit } from '@hapi/hapi';
import { RentalService } from '../services/rental.service';
import { PrismaClient } from '@prisma/client';

const rentalService = new RentalService();
const prisma = new PrismaClient();

export const rentalController = {
  /**
   * @swagger
   * /api/rentals:
   *   get:
   *     tags:
   *       - Rentals
   *     description: Get list of rentals with filtering and sorting
   *     parameters:
   *       - name: start_date
   *         in: query
   *         type: string
   *         format: date-time
   *       - name: end_date
   *         in: query
   *         type: string
   *         format: date-time
   *       - name: store_id
   *         in: query
   *         type: number
   *       - name: customer_id
   *         in: query
   *         type: number
   *       - name: film_id
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
   *         description: List of rentals
   */
  getRentals: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { query } = request;
        
        const filter = {
          date_range: query.start_date && query.end_date ? {
            start: new Date(query.start_date),
            end: new Date(query.end_date)
          } : undefined,
          store_id: query.store_id ? Number(query.store_id) : undefined,
          customer_id: query.customer_id ? Number(query.customer_id) : undefined,
          film_id: query.film_id ? Number(query.film_id) : undefined
        };

        const sort = query.sort_field ? {
          field: query.sort_field,
          order: query.sort_order || 'asc'
        } : undefined;

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        const result = await rentalService.getRentals(filter, sort, page, limit);
        return h.response(result).code(200);
      } catch (error) {
        console.error('Error in getRentals:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching rentals.'
        }).code(500);
      }
    }
  },

  /**
   * @swagger
   * /api/rentals/{id}:
   *   get:
   *     tags:
   *       - Rentals
   *     description: Get rental details by ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: number
   *     responses:
   *       200:
   *         description: Rental details
   *       404:
   *         description: Rental not found
   */
  getRentalById: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const id = Number(request.params.id);
        const rental = await rentalService.getRentalById(id);
        
        if (!rental) {
          return h.response({ message: 'Rental not found' }).code(404);
        }
        
        return h.response(rental).code(200);
      } catch (error) {
        console.error('Error in getRentalById:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching the rental.'
        }).code(500);
      }
    }
  },

  /**
   * @swagger
   * /api/rentals/filter-options:
   *   get:
   *     tags:
   *       - Rentals
   *     description: Get filter options for rentals
   *     responses:
   *       200:
   *         description: Filter options for rentals
   */
  getFilterOptions: {
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const [stores, customers, films] = await Promise.all([
          prisma.store.findMany({
            select: {
              store_id: true,
              address: {
                select: {
                  address: true,
                  city: {
                    select: {
                      city: true
                    }
                  }
                }
              }
            }
          }),
          prisma.customer.findMany({
            select: {
              customer_id: true,
              first_name: true,
              last_name: true
            }
          }),
          prisma.film.findMany({
            select: {
              film_id: true,
              title: true
            }
          })
        ]);

        return h.response({
          stores: stores.map(store => ({
            store_id: store.store_id,
            name: `${store.address.address}, ${store.address.city.city}`
          })),
          customers: customers.map(customer => ({
            customer_id: customer.customer_id,
            name: `${customer.first_name} ${customer.last_name}`
          })),
          films: films.map(film => ({
            film_id: film.film_id,
            title: film.title
          }))
        }).code(200);
      } catch (error) {
        console.error('Error in getFilterOptions:', error);
        return h.response({ 
          error: 'Internal Server Error',
          message: 'An error occurred while fetching filter options.'
        }).code(500);
      }
    }
  }
}; 