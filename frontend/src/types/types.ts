export type CustomerType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  createdAt: Date;
};

export type CategoryType = {
  id: string;
  name: string;
  createdAt: Date;
};

export type ServiceType = {
  id: string;
  name: string;
  price: number;
  duration: number;
  createdAt: Date;
};
