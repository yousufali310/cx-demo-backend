import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
  async getCategories() {
    try {
      const categories = await prisma.category.findMany({
        select: {
          category_id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return {
        data: categories,
        total: categories.length
      };
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  }
} 