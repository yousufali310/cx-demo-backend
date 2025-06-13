import { ServerRoute } from '@hapi/hapi';
import { rentalController } from '../controllers/rental.controller';
import Joi from 'joi';

export const rentalRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/rentals',
    options: {
      handler: rentalController.getRentals.handler,
      description: 'Get all rentals',
      notes: 'Returns a list of rentals with optional filtering',
      tags: ['api', 'rentals'],
      plugins: {
        'hapi-swagger': {
          parameters: [
            {
              name: 'filter',
              in: 'query',
              description: 'Filter parameters',
              schema: Joi.object({
                date: Joi.object({
                  from: Joi.date().description('Start date'),
                  to: Joi.date().description('End date')
                }).description('Date range filter'),
                store: Joi.alternatives().try(Joi.number(), Joi.string()).description('Store ID'),
                customer: Joi.alternatives().try(Joi.number(), Joi.string()).description('Customer ID'),
                film: Joi.alternatives().try(Joi.number(), Joi.string()).description('Film ID'),
                return_status: Joi.string().valid('returned', 'pending').description('Return status')
              })
            },
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              schema: Joi.number().default(1)
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Items per page',
              schema: Joi.number().default(10)
            }
          ],
          responses: {
            '200': {
              description: 'List of rentals',
              schema: Joi.object({
                data: Joi.array().items(Joi.object({
                  rental_id: Joi.number().description('Rental ID'),
                  rental_date: Joi.date().description('Rental date'),
                  inventory_id: Joi.number().description('Inventory ID'),
                  customer_id: Joi.number().description('Customer ID'),
                  return_date: Joi.date().allow(null).description('Return date'),
                  staff_id: Joi.number().description('Staff ID'),
                  last_update: Joi.date().description('Last update timestamp'),
                  customer: Joi.object({
                    first_name: Joi.string().description('Customer first name'),
                    last_name: Joi.string().description('Customer last name'),
                    email: Joi.string().description('Customer email')
                  }).description('Customer information'),
                  inventory: Joi.object({
                    film: Joi.object({
                      title: Joi.string().description('Film title'),
                      rental_rate: Joi.number().description('Rental rate')
                    }).description('Film information'),
                    store: Joi.object({
                      store_id: Joi.number().description('Store ID'),
                      address: Joi.object({
                        address: Joi.string().description('Store address'),
                        city: Joi.object({
                          city: Joi.string().description('City name')
                        }).description('City information')
                      }).description('Store address')
                    }).description('Store information')
                  }).description('Inventory information')
                })).description('Array of rentals'),
                pagination: Joi.object({
                  total: Joi.number().description('Total number of items'),
                  page: Joi.number().description('Current page'),
                  limit: Joi.number().description('Items per page'),
                  totalPages: Joi.number().description('Total number of pages')
                }).description('Pagination information')
              })
            },
            '400': {
              description: 'Bad Request',
              schema: Joi.object({
                error: Joi.string(),
                message: Joi.string()
              })
            },
            '500': {
              description: 'Internal Server Error',
              schema: Joi.object({
                error: Joi.string(),
                message: Joi.string()
              })
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/rentals/{id}',
    options: {
      handler: rentalController.getRentalById.handler,
      description: 'Get a specific rental by ID',
      notes: 'Returns a single rental with detailed information',
      tags: ['api', 'rentals'],
      plugins: {
        'hapi-swagger': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Rental ID',
              schema: Joi.number().required()
            }
          ],
          responses: {
            '200': {
              description: 'Rental details',
              schema: Joi.object({
                rental_id: Joi.number().description('Rental ID'),
                rental_date: Joi.date().description('Rental date'),
                inventory_id: Joi.number().description('Inventory ID'),
                customer_id: Joi.number().description('Customer ID'),
                return_date: Joi.date().allow(null).description('Return date'),
                staff_id: Joi.number().description('Staff ID'),
                last_update: Joi.date().description('Last update timestamp'),
                customer: Joi.object({
                  first_name: Joi.string().description('Customer first name'),
                  last_name: Joi.string().description('Customer last name'),
                  email: Joi.string().description('Customer email'),
                  address: Joi.object({
                    address: Joi.string().description('Customer address'),
                    city: Joi.object({
                      city: Joi.string().description('City name'),
                      country: Joi.object({
                        country: Joi.string().description('Country name')
                      }).description('Country information')
                    }).description('City information')
                  }).description('Customer address')
                }).description('Customer information'),
                inventory: Joi.object({
                  film: Joi.object({
                    title: Joi.string().description('Film title'),
                    description: Joi.string().allow(null).description('Film description'),
                    release_year: Joi.number().allow(null).description('Release year'),
                    rental_rate: Joi.number().description('Rental rate'),
                    length: Joi.number().allow(null).description('Film length'),
                    rating: Joi.string().allow(null).description('Film rating'),
                    category: Joi.object({
                      name: Joi.string().description('Category name')
                    }).description('Film category')
                  }).description('Film information'),
                  store: Joi.object({
                    store_id: Joi.number().description('Store ID'),
                    address: Joi.object({
                      address: Joi.string().description('Store address'),
                      city: Joi.object({
                        city: Joi.string().description('City name')
                      }).description('City information')
                    }).description('Store address')
                  }).description('Store information')
                }).description('Inventory information'),
                staff: Joi.object({
                  first_name: Joi.string().description('Staff first name'),
                  last_name: Joi.string().description('Staff last name'),
                  email: Joi.string().description('Staff email')
                }).description('Staff information')
              })
            },
            '404': {
              description: 'Rental not found',
              schema: Joi.object({
                message: Joi.string().description('Error message')
              })
            },
            '400': {
              description: 'Invalid ID',
              schema: Joi.object({
                error: Joi.string(),
                message: Joi.string()
              })
            },
            '500': {
              description: 'Internal Server Error',
              schema: Joi.object({
                error: Joi.string(),
                message: Joi.string()
              })
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/rentals/filter-options',
    options: {
      handler: rentalController.getFilterOptions.handler,
      description: 'Get filter options for rentals',
      notes: 'Returns available options for filtering rentals',
      tags: ['api', 'rentals'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Filter options',
              schema: Joi.object({
                stores: Joi.array().items(Joi.object({
                  store_id: Joi.number(),
                  name: Joi.string()
                })),
                customers: Joi.array().items(Joi.object({
                  customer_id: Joi.number(),
                  name: Joi.string()
                })),
                films: Joi.array().items(Joi.object({
                  film_id: Joi.number(),
                  title: Joi.string()
                }))
              })
            },
            '500': {
              description: 'Internal Server Error'
            }
          }
        }
      }
    }
  }
]; 