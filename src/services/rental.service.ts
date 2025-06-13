import { PrismaClient } from '@prisma/client';
import { IRentalFilter } from '../interfaces/rental.interface';

const prisma = new PrismaClient();

export class RentalService {
  async getRentals(
    filter?: IRentalFilter,
    sort?: { field: string; order: 'asc' | 'desc' },
    page = 1,
    limit = 10
  ) {
    const where: any = {};

    if (filter) {
      if (filter.date_range) {
        where.rental_date = {
          gte: filter.date_range.start,
          lte: filter.date_range.end
        };
      }
      if (filter.store_id) {
        where.inventory = {
          store_id: filter.store_id
        };
      }
      if (filter.customer_id) {
        where.customer_id = filter.customer_id;
      }
      if (filter.film_id) {
        where.inventory = {
          ...where.inventory,
          film_id: filter.film_id
        };
      }
    }

    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.order;
    }

    const skip = (page - 1) * limit;

    try {
      const [rentals, total] = await Promise.all([
        prisma.rental.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            inventory: {
              include: {
                film: true,
                store: {
                  include: {
                    address: {
                      include: {
                        city: {
                          include: {
                            country: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            customer: {
              include: {
                address: {
                  include: {
                    city: {
                      include: {
                        country: true
                      }
                    }
                  }
                }
              }
            },
            payment: true
          }
        }),
        prisma.rental.count({ where })
      ]);

      // Calculate rental duration for each rental
      const enrichedRentals = rentals.map(rental => {
        const duration = rental.return_date
          ? Math.ceil((rental.return_date.getTime() - rental.rental_date.getTime()) / (1000 * 60 * 60 * 24))
          : null;

        return {
          ...rental,
          duration
        };
      });

      return {
        data: enrichedRentals,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error in getRentals:', error);
      throw new Error('Failed to fetch rentals');
    }
  }

  async getRentalById(rentalId: number) {
    try {
      const rental = await prisma.rental.findUnique({
        where: { rental_id: rentalId },
        include: {
          inventory: {
            include: {
              film: true,
              store: {
                include: {
                  address: {
                    include: {
                      city: {
                        include: {
                          country: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          customer: {
            include: {
              address: {
                include: {
                  city: {
                    include: {
                      country: true
                    }
                  }
                }
              }
            }
          },
          payment: true
        }
      });

      if (!rental) {
        return null;
      }

      const duration = rental.return_date
        ? Math.ceil((rental.return_date.getTime() - rental.rental_date.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...rental,
        duration
      };
    } catch (error) {
      console.error('Error in getRentalById:', error);
      throw new Error('Failed to fetch rental details');
    }
  }
}