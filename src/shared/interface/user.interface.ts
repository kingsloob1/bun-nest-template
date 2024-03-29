import { BunRequest } from '@kingsleyweb/bun-common';

export interface WhoAmI {
  roleType: string;
  urId: string;
  companyId: number;
  isAdmin: boolean;
  storeId: number[];
  branchId: number[];
}

export interface User {
  id: number;
  name: string;
  localizedName: string;
  email: string;
  isAdmin: boolean;
  password: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  phone: string;
  telegramId: string;
}

export interface UserAndRoles extends User {
  whoAmI: WhoAmI;
}

export interface AuthRequest extends BunRequest {
  user: UserAndRoles;
}
