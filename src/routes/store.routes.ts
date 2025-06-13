import { ServerRoute } from '@hapi/hapi';
import { storeController } from '../controllers/store.controller';
import Joi from 'joi';

export const storeRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/stores',
    options: {
      handler: storeController.getStores.handler,
      description: 'Get all stores',
      notes: 'Returns a list of stores with optional filtering',
      tags: ['api', 'stores'],
      validate: {
        query: Joi.object({
          filter: Joi.object({
            city: Joi.string().description('City name'),
            zip_code: Joi.string().description('ZIP code'),
            staff_count: Joi.object({
              gt: Joi.number().description('Greater than staff count'),
              lt: Joi.number().description('Less than staff count'),
              eq: Joi.number().description('Equal to staff count')
            }).description('Staff count filters')
          }).description('Filter parameters'),
          page: Joi.number().default(1).description('Page number'),
          limit: Joi.number().default(10).description('Items per page')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'List of stores',
              schema: Joi.object({
                data: Joi.array().items(Joi.object({
                  store_id: Joi.number().description('Store ID'),
                  manager_staff_id: Joi.number().description('Manager staff ID'),
                  address_id: Joi.number().description('Address ID'),
                  last_update: Joi.date().description('Last update timestamp'),
                  staff_count: Joi.number().description('Number of staff members'),
                  rental_count: Joi.number().description('Number of rentals'),
                  address: Joi.object({
                    address: Joi.string().description('Street address'),
                    address2: Joi.string().allow(null).description('Additional address'),
                    district: Joi.string().description('District'),
                    city: Joi.object({
                      city: Joi.string().description('City name'),
                      country: Joi.object({
                        country: Joi.string().description('Country name')
                      }).description('Country information')
                    }).description('City information'),
                    postal_code: Joi.string().allow(null).description('Postal code'),
                    phone: Joi.string().description('Phone number')
                  }).description('Store address')
                })).description('Array of stores'),
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
    path: '/stores/{id}',
    options: {
      handler: storeController.getStoreById.handler,
      description: 'Get a specific store by ID',
      notes: 'Returns a single store with detailed information',
      tags: ['api', 'stores'],
      validate: {
        params: Joi.object({
          id: Joi.number().required().description('Store ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Store details',
              schema: Joi.object({
                store_id: Joi.number().description('Store ID'),
                manager_staff_id: Joi.number().description('Manager staff ID'),
                address_id: Joi.number().description('Address ID'),
                last_update: Joi.date().description('Last update timestamp'),
                staff_count: Joi.number().description('Number of staff members'),
                rental_count: Joi.number().description('Number of rentals'),
                address: Joi.object({
                  address: Joi.string().description('Street address'),
                  address2: Joi.string().allow(null).description('Additional address'),
                  district: Joi.string().description('District'),
                  city: Joi.object({
                    city: Joi.string().description('City name'),
                    country: Joi.object({
                      country: Joi.string().description('Country name')
                    }).description('Country information')
                  }).description('City information'),
                  postal_code: Joi.string().allow(null).description('Postal code'),
                  phone: Joi.string().description('Phone number')
                }).description('Store address'),
                manager: Joi.object({
                  first_name: Joi.string().description('Manager first name'),
                  last_name: Joi.string().description('Manager last name'),
                  email: Joi.string().description('Manager email')
                }).description('Store manager information')
              })
            },
            '404': {
              description: 'Store not found',
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
    path: '/stores/{id}/staff',
    options: {
      handler: storeController.getStoreStaff.handler,
      description: 'Get staff members of a store',
      notes: 'Returns a list of staff members working at the specified store',
      tags: ['api', 'stores', 'staff'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'List of staff members',
              schema: Joi.object({
                data: Joi.array().items(Joi.object({
                  staff_id: Joi.number(),
                  first_name: Joi.string(),
                  last_name: Joi.string(),
                  email: Joi.string().allow(null),
                  active: Joi.boolean(),
                  username: Joi.string(),
                  address: Joi.object()
                })),
                pagination: Joi.object({
                  total: Joi.number(),
                  page: Joi.number(),
                  limit: Joi.number(),
                  totalPages: Joi.number()
                })
              })
            },
            '404': {
              description: 'Store not found'
            },
            '400': {
              description: 'Invalid ID'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/stores/{id}/rentals',
    options: {
      handler: storeController.getStoreRentals.handler,
      description: 'Get rentals from a store',
      notes: 'Returns a list of rentals made from the specified store',
      tags: ['api', 'stores', 'rentals'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'List of rentals',
              schema: Joi.object({
                data: Joi.array().items(Joi.object({
                  rental_id: Joi.number(),
                  rental_date: Joi.date(),
                  return_date: Joi.date().allow(null),
                  customer: Joi.object(),
                  inventory: Joi.object({
                    film: Joi.object()
                  }),
                  payment: Joi.object()
                })),
                pagination: Joi.object({
                  total: Joi.number(),
                  page: Joi.number(),
                  limit: Joi.number(),
                  totalPages: Joi.number()
                })
              })
            },
            '404': {
              description: 'Store not found'
            },
            '400': {
              description: 'Invalid ID'
            }
          }
        }
      }
    }
  }
]; 