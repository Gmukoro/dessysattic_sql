// type CollectionType = {
//   _id: string;
//   title: string;
//   products: ProductType[];
//   image: string;
// };

// type ProductType = {
//   [x: string]: ReactNode;
//   _id: string;
//   title: string;
//   description: string;
//   media: string[];
//   category: string;
//   collections: string[];
//   tags: string[];
//   price: number;
//   cost: number;
//   sizes: string[];
//   colors: string[];
//   createdAt: string;
//   updatedAt: string;
// };

// // type UserType = {
// //   userId: string;
// //   wishlist: string[];
// //   createdAt: string;
// //   updatedAt: string;
// // };

// type OrderType = {
//   shippingAddress: string;
//   _id: string;
//   customerId: string;
//   products: OrderItemType[];
//   shippingRate: string;
//   totalAmount: number;
// };

// type OrderItemType = {
//   product: ProductType;
//   color: string;
//   size: string;
//   quantity: number;
//   _id: string;
// };

// export interface CurrencyOption {
//   code: string;
//   name: string;
//   symbol: string;
// }

// // User Types

// interface BaseUserDoc {
//   id: string;
//   name: string;
//   email: string;
//   provider: "credentials" | "google";
//   password?: string;
//   avatar?: {
//     id?: string;
//     url: string;
//   };
//   verified: boolean;
//   wishlist?: string[];
// }

// interface CredentialsUserDoc extends BaseUserDoc {
//   provider: "credentials";
//   password: string;
// }

// interface GoogleUserDoc extends BaseUserDoc {
//   provider: "google";
//   password?: never;
// }

// type UserDoc = CredentialsUserDoc | GoogleUserDoc;

// interface Methods {
//   compare(password: string): boolean;
// }

// declare module "next-auth" {
//   interface SessionUserProfile {
//     id?: string | null;
//     name?: string | null;
//     email?: string | null;
//     avatar?: string | null;
//     verified?: boolean | null;
//   }
// }

// // User Types

// interface CredentialsUserDoc extends BaseUserDoc {
//   provider: "credentials";
//   password: string;
// }

// interface GoogleUserDoc extends BaseUserDoc {
//   provider: "google";
//   password?: never;
// }

// type UserDoc = CredentialsUserDoc | GoogleUserDoc;

// interface Methods {
//   compare(password: string): boolean;
// }

// //transfers from Admin

// type CollectionType = {
//   _id: string;
//   title: string;
//   description: string;
//   image: string;
//   products: string[];
// };

// type ProductType = {
//   _id: string;
//   title: string;
//   description: string;
//   media: string;
//   category: string;
//   collections: CollectionType;
//   tags: string;
//   sizes: string;
//   colors: string;
//   price: number;
//   expense: number;
//   createdAt: Date;
//   updatedAt: Date;
// };

// type OrderColumnType = {
//   _id: string;
//   customer: string;
//   products: number;
//   totalAmount: number;
//   createdAt: string;
// };

// type OrderItemType = {
//   productId: string;
//   color: string;
//   size: string;
//   quantity: number;
// };

// export type CustomerType = {
//   id: string;
//   name: string;
//   email: string;
//   orders: string[];
//   createdAt: Date;
//   updatedAt: Date;
// };

// // User Types
// import { ObjectId } from "mongoose";

// interface BaseUserDoc {
//   _id?: ObjectId;
//   name: string;
//   email: string;
//   provider: "credentials" | "google";
//   password?: string;
//   avatar?: {
//     id?: string;
//     url: string;
//   };
//   verified: boolean;
// }

// interface CredentialsUserDoc extends BaseUserDoc {
//   provider: "credentials";
//   password: string;
// }

// interface GoogleUserDoc extends BaseUserDoc {
//   provider: "google";
//   password?: never;
// }

// type UserDoc = CredentialsUserDoc | GoogleUserDoc;

// interface Methods {
//   compare(password: string): boolean;
// }

// Collection Type
type CollectionType = {
  id: string;
  title: string;
  description: string | null;
  products: string[] | null;
  createdAt: string;
  updatedAt: string;
};

// Product Type
type ProductType = {
  id: string;
  title: string;
  description: string | null;
  media: string[] | null;
  category: string;
  tags: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  price: number;
  expense: number | null;
  createdAt: string;
  updatedAt: string;
  collections: string[] | null;
};

// Order Type
type OrderType = {
  id: string;
  customerId: string;
  products: OrderItemType[];
  shippingAddress: ShippingAddressType;
  shippingRate: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

// Order Item Type
type OrderItemType = {
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

// Shipping Address Type
type ShippingAddressType = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

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
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

// User Type
type UserType = {
  id: string;
  username: string;
  email: string;
  password: string;
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
