import { PrismaClient } from '@prisma/client';
import { IFilm, IFilmFilter } from '../interfaces/film.interface';

const prisma = new PrismaClient();

export class FilmService {
  async getFilms(filter?: any, page = 1, limit = 10) {
    const where: any = {};
  
    if (filter) {
      if (filter.category) {
        where.film_category = {
          some: {
            category_id: Number(filter.category)
          }
        };
      }
      if (filter.language) {
        where.language_id = Number(filter.language);
      }
      if (filter.release_year) {
        where.release_year = Number(filter.release_year);
      }
      if (filter.actor) {
        where.film_actor = {
          some: {
            actor_id: Number(filter.actor)
          }
        };
      }
      if (filter.length) {
        if (filter.length.gt) where.length = { ...where.length, gt: Number(filter.length.gt) };
        if (filter.length.lt) where.length = { ...where.length, lt: Number(filter.length.lt) };
        if (filter.length.eq) where.length = Number(filter.length.eq);
      }
    }
  
    const skip = (page - 1) * limit;
  
    const [films, total] = await Promise.all([
      prisma.film.findMany({
        where,
        skip,
        take: limit,
        include: {
          language_film_language_idTolanguage: true,
          film_category: {
            include: {
              category: true
            }
          },
          film_actor: {
            include: {
              actor: true
            }
          }
        }
      }),
      prisma.film.count({ where })
    ]);
  
    return {
      data: films,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  

  async getFilmById(filmId: number) {
    return prisma.film.findUnique({
      where: { film_id: filmId },
      include: {
        language_film_language_idTolanguage: true,
        film_category: {
          include: {
            category: true
          }
        },
        film_actor: {
          include: {
            actor: true
          }
        }
      }
    });
  }

  async getFilterOptions() {
    try {
      const [categories, languages, years, actors] = await Promise.all([
        // Get all categories
        prisma.category.findMany({
          select: {
            category_id: true,
            name: true
          },
          orderBy: {
            name: 'asc'
          }
        }),
        // Get all languages
        prisma.language.findMany({
          select: {
            language_id: true,
            name: true
          },
          orderBy: {
            name: 'asc'
          }
        }),
        // Get unique release years
        prisma.film.findMany({
          select: {
            release_year: true
          },
          distinct: ['release_year'],
          where: {
            release_year: {
              not: null
            }
          },
          orderBy: {
            release_year: 'desc'
          }
        }),
        // Get all actors
        prisma.actor.findMany({
          select: {
            actor_id: true,
            first_name: true,
            last_name: true
          },
          orderBy: [
            { first_name: 'asc' },
            { last_name: 'asc' }
          ]
        })
      ]);

      return {
        categories,
        languages,
        years: years.map(y => y.release_year).filter(Boolean),
        actors: actors.map(actor => ({
          ...actor,
          full_name: `${actor.first_name} ${actor.last_name}`
        }))
      };
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      throw error;
    }
  }
} 