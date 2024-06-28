export interface Customer {
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    address: Address[];
    phone: string;
    active: boolean;
    created_at: Date;
  }
  
  export interface Address {
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    postalcode: string;
  }
  