import { PrismaClient, staff, rental } from '@prisma/client';
import { IStoreFilter } from '../interfaces/store.interface';

const prisma = new PrismaClient();

type StoreWithRelations = {
  staff: staff[];
  inventory: {
    rental: rental[];
  }[];
} & any;

export class StoreService {
  async getStores(
    filter?: IStoreFilter,
    sort?: { field: string; order: 'asc' | 'desc' },
    page = 1,
    limit = 10
  ) {
    const where: any = {};

    if (filter) {
      if (filter.city) {
        where.address = {
          city: {
            city: {
              contains: filter.city,
              mode: 'insensitive'
            }
          }
        };
      }
      // if (filter.country) {
      //   where.address = {
      //     ...where.address,
      //     city: {
      //       ...where.address?.city,
      //       country: {
      //         country: {
      //           contains: filter.country,
      //           mode: 'insensitive'
      //         }
      //       }
      //     }
      //   };
      // }
    }

    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.order;
    }

    const skip = (page - 1) * limit;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          address: {
            include: {
              city: {
                include: {
                  country: true
                }
              }
            }
          },
          staff: {
            select: {
              staff_id: true,
              first_name: true,
              last_name: true,
              email: true,
              username: true,
              address: {
                select: {
                  address: true,
                  district: true,
                  phone: true,
                  city: {
                    select: {
                      city: true,
                      country: {
                        select: {
                          country: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.store.count({ where })
    ]);

    return {
      data: stores,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getStoreById(storeId: number) {
    const store = await prisma.store.findUnique({
      where: { store_id: storeId },
      include: {
        address: {
          include: {
            city: {
              include: {
                country: true,
              },
            },
          },
        },
        staff: {
          select: {
            staff_id: true,
            first_name: true,
            last_name: true,
            email: true,
            username: true,
            address: {
              select: {
                address: true,
                district: true,
                phone: true,
                city: {
                  select: {
                    city: true,
                    country: {
                      select: {
                        country: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  
    const rentals = await prisma.rental.findMany({
      where: {
        inventory: {
          store_id: storeId,
        },
      },
      select: {
        rental_id: true,
        rental_date: true,
        return_date: true,
        customer: {
          select: {
            customer_id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        staff: {
          select: {
            staff_id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  
    return { ...store, rentals };
  }
  

  async getStoreStaff(storeId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where: { store_id: storeId },
        skip,
        take: limit,
        include: {
          address: true
        }
      }),
      prisma.staff.count({
        where: { store_id: storeId }
      })
    ]);

    return {
      data: staff,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getStoreRentals(storeId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [rentals, total] = await Promise.all([
      prisma.rental.findMany({
        where: {
          inventory: {
            store_id: storeId
          }
        },
        skip,
        take: limit,
        include: {
          customer: true,
          inventory: {
            include: {
              film: true
            }
          },
          payment: true
        }
      }),
      prisma.rental.count({
        where: {
          inventory: {
            store_id: storeId
          }
        }
      })
    ]);

    return {
      data: rentals,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
} 