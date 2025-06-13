export interface IStore {
  store_id: number;
  manager_staff_id: number;
  address_id: number;
  last_update: Date;
  rental_count?: number;
  staff_count?: number;
}

export interface IStoreFilter {
  city?: string;
  zip_code?: string;
  staff_count?: {
    gt?: number;
    lt?: number;
    eq?: number;
  };
}

export interface IStoreDetails {
  store: IStore;
  manager: {
    staff_id: number;
    first_name: string;
    last_name: string;
  };
  address: {
    address: string;
    address2?: string;
    district: string;
    city: string;
    postal_code?: string;
    phone: string;
  };
} 