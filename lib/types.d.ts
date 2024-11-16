// Collection Type
type CollectionType = {
  [x: string]: string;
  _id: string;
  title: string;
  description?: string;
  image: string;
  products: ProductType[];
  createdAt?: Date;
  updatedAt?: Date;
};

// Product Type
type ProductType = {
  id: string;
  title: string;
  description: string;
  media: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  price: number;
  collections: string[];
  expense?: number;
  createdAt?: Date;
  updatedAt?: Date;
  currencySymbol?: string;
};

// Order Type
type OrderType = {
  _id: string;
  products: {
    product: {
      _id: string;
      title: string;
      media: string[];
      price: number;
      description?: string;
      category?: string;
      tags?: string[];
      sizes?: string[];
      colors?: string[];
    };
    color: string;
    size: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  shippingRate: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
};

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount?: number;
  createdAt: string;
};

type OrderItemProductType = {
  _id: string;
  title: string;
  media: string[];
  price: number;
  description?: string;
  category?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
};

type OrderItemType = {
  product: OrderItemProductType;
  color: string;
  size: string;
  quantity: number;
};

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Customer Type
type CustomerType = {
  id: string;
  name: string;
  email: string;
  orders: OrderType[];
  createdAt: string;
  updatedAt: string;
};

// Review Type
type ReviewType = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// User Type
type UserType = {
  id: string;
  username: string;
  email: string;
  password: string;
  wishlist?: string[];
  createdAt: string;
  updatedAt: string;
};

type BaseUserDoc = UserType & {
  id: string;
  name: string;
  email: string;
  password: string;
  wishlist: string[];
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

// Newsletter Type
type NewsletterType = {
  email: string;
  date: string;
};

// Password Reset Token Type
type PasswordResetTokenType = {
  id: string;
  token: string;
  userId: string;
  expires: string;
};

// Verification Token Type
type VerificationTokenType = {
  id: string;
  token: string;
  userId: string;
  expires: string;
};
