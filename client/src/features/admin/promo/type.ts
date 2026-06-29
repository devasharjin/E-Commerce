
export type Promo = {
  _id : string
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type FormPromo = {
  code: string;
  percentage: string;
  count: string;
  minimumOrderValue: string;
  startAt: string;
  endAt: string;
};

export type PromoPayload = {
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startAt: Date;
  endAt: Date;
};
