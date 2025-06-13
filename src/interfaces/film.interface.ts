import { film_rating } from '@prisma/client';

export interface IFilm {
  film_id: number;
  title: string;
  description?: string | null;
  release_year?: number | null;
  language_id: number;
  original_language_id?: number | null;
  rental_duration: number;
  rental_rate: number;
  length?: number | null;
  replacement_cost: number;
  rating?: film_rating | null;
  special_features?: string | null;
  last_update: Date;
}

export interface IFilmFilter {
  category?: number;
  language?: number;
  release_year?: number;
  length?: {
    gt?: number;
    lt?: number;
    eq?: number;
  };
  actor?: number;
} 