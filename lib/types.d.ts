// Collection Type
type CollectionType = {
  id: string;
  title: string;
  description: string;
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
  category: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  price: number;
  collections: CollectionType[];
  expense: number;
  createdAt?: Date;
  updatedAt?: Date;
  currencySymbol?: string;
};

type OrderColumnType = {
  id: string;
  customer: string;
  products: number;
  totalAmount?: number;
  createdAt: string;
};

type OrderItemProductType = {
  id: string;
  title: string;
  media: string[];
  price: number;
  description?: string;
  category?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
};

type OrderType = {
  _id?: string;
  products: OrderItemType[];
  shippingAddress: ShippingAddress;
  shippingRate: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
};

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

// Customer Type
type CustomerType = {
  id: string;
  name: string;
  email: string;
  orders: OrderType[];
  createdAt: Date;
  updatedAt: Date;
};

// Review Type
type ReviewType = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

// User Type
type UserType = {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  wishlist: string[];
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
};

type BaseUserDoc = UserType & {
  id: number;
  name: string;
  email: string;
  password: string;
  wishlist: string[];
  role: "admin" | "user";
  avatar: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Newsletter Type
type NewsletterType = {
  email: string;
  date: Date;
};

// Password Reset Token Type
type PasswordResetTokenType = {
  id: string;
  token: string;
  userId: string;
  expires: Date;
};

// Verification Token Type
type VerificationTokenType = {
  id: string;
  token: string;
  userId: string;
  expires: Date;
};

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
};
