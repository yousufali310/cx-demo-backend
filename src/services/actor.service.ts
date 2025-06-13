import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ActorService {
  async getActors() {
    try {
      const actors = await prisma.actor.findMany({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true
        },
        orderBy: [
          { first_name: 'asc' },
          { last_name: 'asc' }
        ]
      });

      return {
        data: actors,
        total: actors.length
      };
    } catch (error) {
      console.error('Error in getActors:', error);
      throw error;
    }
  }
} 