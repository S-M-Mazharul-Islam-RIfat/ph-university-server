import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import AppError from "../errors/AppError";
import status from "http-status";
import config from "../config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";

export const auth = (...requiredRoles: TUserRole[]) => {
   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;
      // if the token is sent from the client
      if (!token) {
         throw new AppError(status.UNAUTHORIZED, 'You are not authorized')
      }

      // checking if the given token is valid
      const decoded = jwt.verify(
         token,
         config.jwt_access_secret as string,
      ) as JwtPayload;


      const { role, userId, iat } = decoded;


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

      if (requiredRoles && !requiredRoles.includes(role)) {
         throw new AppError(status.UNAUTHORIZED, 'You are not authorized')
      }
      req.user = decoded as JwtPayload;
      next();


   })
}