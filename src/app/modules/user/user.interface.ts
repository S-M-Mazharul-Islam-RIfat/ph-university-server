import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
   id: string;
   password: string;
   needsPasswordChange: boolean;
   passwordChangedAt?: Date;
   role: 'admin' | 'student' | 'faculty';
   status: 'in-progress' | 'blocked';
   isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModelType extends Model<TUser> {
   //instance methods for checking if the user exist
   isUserExistsByCustomId(id: string): Promise<TUser>;
   isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
   isJWTIssuedBeforePasswordChanged(passwordChangedTimestamp: Date, jwtIssuedTimestamp: number): boolean;
}