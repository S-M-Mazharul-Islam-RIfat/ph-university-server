import status from "http-status";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import config from "../../config";
import bcrypt from 'bcrypt';
import { createToken } from "./auth.utils";

const loginUser = async (payload: TLoginUser) => {

   // checking if the user is exist
   const user = await UserModel.isUserExistsByCustomId(payload?.id);

   if (!user) {
      throw new AppError(status.NOT_FOUND, 'User not found');
   }

   // checking if the user is already deleted
   const isDeleted = user?.isDeleted;
   if (isDeleted) {
      throw new AppError(status.FORBIDDEN, 'This user is deleted');
   }


   // check if the user is blocked or not

   const userStatus = user?.status;

   if (userStatus === 'blocked') {
      throw new AppError(status.FORBIDDEN, 'This user is blocked');
   }

   // check if the password is correct
   const passwordMatched = await UserModel.isPasswordMatched(payload?.password, user?.password);
   if (!passwordMatched) {
      throw new AppError(status.FORBIDDEN, 'Password is not matched');
   }


   // create token and sent to the client
   const jwtPayload = {
      userId: user.id,
      role: user.role
   }

   const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '7d',
   );

   const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      '7d',
   );


   return {
      accessToken,
      refreshToken,
      needsPasswordChange: user?.needsPasswordChange
   }
}


const changePassword = async (userData: JwtPayload, payload: { oldPassword: string, newPassword: string }) => {
   // checking if the user is exist
   const user = await UserModel.isUserExistsByCustomId(userData?.userId);

   if (!user) {
      throw new AppError(status.NOT_FOUND, 'User not found');
   }

   // checking if the user is already deleted
   const isDeleted = user?.isDeleted;
   if (isDeleted) {
      throw new AppError(status.FORBIDDEN, 'This user is deleted');
   }


   // check if the user is blocked or not

   const userStatus = user?.status;

   if (userStatus === 'blocked') {
      throw new AppError(status.FORBIDDEN, 'This user is blocked');
   }

   // check if the password is correct
   const passwordMatched = await UserModel.isPasswordMatched(payload?.oldPassword, user?.password);
   if (!passwordMatched) {
      throw new AppError(status.FORBIDDEN, 'Password is not matched');
   }


   // hash new password
   const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

   await UserModel.findOneAndUpdate({
      id: userData.userId,
      role: userData.role
   }, {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date
   })

   return null;
}


const refreshToken = async (token: string) => {

   // if the token is valid or not
   const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;
   const { userId, iat } = decoded;

   // checking if the user is exist
   const user = await UserModel.isUserExistsByCustomId(userId);

   if (!user) {
      throw new AppError(status.NOT_FOUND, 'User not found');
   }

   // checking if the user is already deleted
   const isDeleted = user?.isDeleted;
   if (isDeleted) {
      throw new AppError(status.FORBIDDEN, 'This user is deleted');
   }


   // check if the user is blocked or not

   const userStatus = user?.status;

   if (userStatus === 'blocked') {
      throw new AppError(status.FORBIDDEN, 'This user is blocked');
   }

   if (user.passwordChangedAt && UserModel.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized')
   }

   // create token and sent to the client
   const jwtPayload = {
      userId: user.id,
      role: user.role
   }

   const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '7d',
   );

   return {
      accessToken
   };
}


export const AuthServices = {
   loginUser,
   changePassword,
   refreshToken
}