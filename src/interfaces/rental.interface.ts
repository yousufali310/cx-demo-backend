export interface IRental {
  rental_id: number;
  rental_date: Date;
  inventory_id: number;
  customer_id: number;
  return_date?: Date | null;
  staff_id: number;
  last_update: Date;
}

export interface IRentalFilter {
  date_range?: {
    start: Date;
    end: Date;
  };
  store_id?: number;
  customer_id?: number;
  film_id?: number;
}

export interface IRentalDetails {
  rental: IRental;
  film: {
    film_id: number;
    title: string;
    rental_rate: number;
  };
  customer: {
    customer_id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
  store: {
    store_id: number;
    address: string;
  };
  payment: {
    payment_id: number;
    amount: number;
    payment_date: Date;
  };
} 