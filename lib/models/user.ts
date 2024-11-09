//lib\models\user.ts

import { DataTypes, Model } from "sequelize";
import sequelize from "@/app/api/sequelize.config";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

class User extends Model {
  [x: string]: any;
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public avatar!: { id?: string; url: string };
  public verified!: boolean;
  public wishlist!: string[];

  // Method to compare passwords
  public compare(password: string): boolean {
    return compareSync(password, this.password);
  }

  // Pre-save hook to hash password
  static hashPassword(user: User) {
    if (user.isModified("password") && user.password) {
      const salt = genSaltSync(10);
      user.password = hashSync(user.password, salt);
    }
  }
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "credentials",
    },
    wishlist: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        user.email = user.email.trim();
        user.name = user.name.trim();
        User.hashPassword(user);
      },
      beforeUpdate: (user) => {
        user.email = user.email.trim();
        user.name = user.name.trim();
        User.hashPassword(user);
      },
    },
  }
);

export default User;

// Create a new user
export const createNewUser = async (userInfo: Partial<User>): Promise<User> => {
  return User.create(userInfo);
};

// Filter wishlist based on item ID
export const filterWishlist = (user: User, someId: string) => {
  if (!Array.isArray(user.wishlist)) {
    throw new Error("Wishlist is not valid.");
  }

  const filteredItems = user.wishlist.filter((item) => item === someId);
  if (filteredItems.length === 0) {
    throw new Error(`Item with ID ${someId} not found in wishlist.`);
  }

  return filteredItems;
};
