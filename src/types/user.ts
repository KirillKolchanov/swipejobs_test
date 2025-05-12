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

export interface Job {
  jobId: string;
  jobTitle: {
    name: string;
    imageUrl: string;
  };
  company: {
    name: string;
    address: {
      formattedAddress: string;
      zoneId: string;
    };
    reportTo: {
      name: string;
      phone?: string;
    };
  };
  wagePerHourInCents: number;
  milesToTravel: number;
  shifts: {
    startDate: string;
    endDate: string;
  }[];
  branch: string;
  branchPhoneNumber: string;
  requirements?: string[];
}
