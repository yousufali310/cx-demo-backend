import { ServerRoute } from '@hapi/hapi';
import { filmController } from '../controllers/film.controller';
import { categoryController } from '../controllers/category.controller';
import { languageController } from '../controllers/language.controller';
import { actorController } from '../controllers/actor.controller';
import { rentalRoutes } from './rental.routes';

export const routes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/films',
    options: filmController.getFilms
  },
  {
    method: 'GET',
    path: '/films/{id}',
    options: filmController.getFilmById
  },
  {
    method: 'GET',
    path: '/categories',
    options: categoryController.getCategories
  },
  {
    method: 'GET',
    path: '/languages',
    options: languageController.getLanguages
  },
  {
    method: 'GET',
    path: '/actors',
    options: actorController.getActors
  },
  ...rentalRoutes
]; 