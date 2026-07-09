export type Address = {
  _id?: string;
  fullName: string;
  address: string;
  city: string;
  pinCode: string;
  isDefault: boolean;
};

export type AddressBodyForm = {
  fullName: string;
  address: string;
  city: string;
  pinCode: string;
  isDefault: boolean;
};
