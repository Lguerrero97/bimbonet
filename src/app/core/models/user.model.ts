import { Role } from "./role.enum";

export interface UserAdmin {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  destacado?: boolean;
  checked: boolean; 
}