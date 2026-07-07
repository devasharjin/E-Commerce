export type CustomerWishlist = {
  id: string;
  title: string;
  Category: string;
  brand: string;
  image: string;
  price: number;
};

export type CustomerWishlistBody = {
  productId: string;
};
