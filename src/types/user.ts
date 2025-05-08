export interface UserAddress {
  formattedAddress: string;
  zoneId: string;
}

export interface User {
  address: UserAddress;
  email: string;
  firstName: string;
  lastName: string;
  maxJobDistance: number;
  phoneNumber: string;
  workerId: string;
}
