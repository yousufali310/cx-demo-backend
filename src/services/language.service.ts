import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LanguageService {
  async getLanguages() {
    try {
      const languages = await prisma.language.findMany({
        select: {
          language_id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return {
        data: languages,
        total: languages.length
      };
    } catch (error) {
      console.error('Error in getLanguages:', error);
      throw error;
    }
  }
} 