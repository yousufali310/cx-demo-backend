import { ServerRoute } from '@hapi/hapi';
import { filmController } from '../controllers/film.controller';
import Joi from 'joi';

export const filmRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/films',
    options: {
      handler: filmController.getFilms.handler,
      description: 'Get all films',
      notes: 'Returns a list of films with optional filtering and sorting',
      tags: ['api', 'films'],
      validate: {
        query: Joi.object({
          filter: Joi.alternatives().try(
            Joi.string(),
            Joi.object({
              category: Joi.alternatives().try(Joi.number(), Joi.string()).description('Category ID'),
              language: Joi.alternatives().try(Joi.number(), Joi.string()).description('Language ID'),
              release_year: Joi.alternatives().try(Joi.number(), Joi.string()).description('Release year'),
              length: Joi.object({
                gt: Joi.number().description('Greater than length (minutes)'),
                lt: Joi.number().description('Less than length (minutes)'),
                eq: Joi.number().description('Equal to length (minutes)')
              }).description('Film length filters'),
              actor: Joi.alternatives().try(Joi.number(), Joi.string()).description('Actor ID')
            })
          ).description('Filter parameters'),
          sort: Joi.object({
            field: Joi.string().description('Field to sort by'),
            order: Joi.string().valid('asc', 'desc').description('Sort order')
          }).description('Sort parameters'),
          page: Joi.number().default(1).description('Page number'),
          limit: Joi.number().default(10).description('Items per page')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'List of films',
              schema: Joi.object({
                data: Joi.array().items(Joi.object({
                  film_id: Joi.number().description('Film ID'),
                  title: Joi.string().description('Film title'),
                  description: Joi.string().allow(null).description('Film description'),
                  release_year: Joi.number().allow(null).description('Release year'),
                  language_id: Joi.number().description('Language ID'),
                  rental_duration: Joi.number().description('Rental duration in days'),
                  rental_rate: Joi.number().description('Rental rate'),
                  length: Joi.number().allow(null).description('Film length in minutes'),
                  replacement_cost: Joi.number().description('Replacement cost'),
                  rating: Joi.string().allow(null).description('Film rating'),
                  special_features: Joi.string().allow(null).description('Special features'),
                  last_update: Joi.date().description('Last update timestamp')
                })).description('Array of films'),
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
    path: '/films/{id}',
    options: {
      handler: filmController.getFilmById.handler,
      description: 'Get a specific film by ID',
      notes: 'Returns a single film with detailed information',
      tags: ['api', 'films'],
      validate: {
        params: Joi.object({
          id: Joi.number().required().description('Film ID')
        })
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Film details',
              schema: Joi.object({
                film_id: Joi.number().description('Film ID'),
                title: Joi.string().description('Film title'),
                description: Joi.string().allow(null).description('Film description'),
                release_year: Joi.number().allow(null).description('Release year'),
                language_id: Joi.number().description('Language ID'),
                rental_duration: Joi.number().description('Rental duration in days'),
                rental_rate: Joi.number().description('Rental rate'),
                length: Joi.number().allow(null).description('Film length in minutes'),
                replacement_cost: Joi.number().description('Replacement cost'),
                rating: Joi.string().allow(null).description('Film rating'),
                special_features: Joi.string().allow(null).description('Special features'),
                last_update: Joi.date().description('Last update timestamp'),
                language: Joi.object({
                  name: Joi.string().description('Language name')
                }).description('Film language'),
                category: Joi.object({
                  name: Joi.string().description('Category name')
                }).description('Film category'),
                actors: Joi.array().items(Joi.object({
                  actor_id: Joi.number().description('Actor ID'),
                  first_name: Joi.string().description('Actor first name'),
                  last_name: Joi.string().description('Actor last name')
                })).description('Film actors')
              })
            },
            '404': {
              description: 'Film not found',
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
    path: '/films/filter-options',
    options: {
      handler: filmController.getFilterOptions.handler,
      description: 'Get filter options for films',
      notes: 'Returns available categories, languages, release years, and actors for filtering',
      tags: ['api', 'films'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Filter options',
              schema: Joi.object({
                categories: Joi.array().items(Joi.object({
                  category_id: Joi.number().description('Category ID'),
                  name: Joi.string().description('Category name')
                })).description('Available categories'),
                languages: Joi.array().items(Joi.object({
                  language_id: Joi.number().description('Language ID'),
                  name: Joi.string().description('Language name')
                })).description('Available languages'),
                years: Joi.array().items(Joi.number()).description('Available release years'),
                actors: Joi.array().items(Joi.object({
                  actor_id: Joi.number().description('Actor ID'),
                  first_name: Joi.string().description('Actor first name'),
                  last_name: Joi.string().description('Actor last name'),
                  full_name: Joi.string().description('Actor full name')
                })).description('Available actors')
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
  }
]; 