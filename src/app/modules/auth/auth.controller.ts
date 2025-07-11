import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req, res) => {
   const result = await AuthServices.loginUser(req.body);
   const { accessToken, refreshToken, needsPasswordChange } = result;
   res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true
   })

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'User is logged in successfully',
      data: {
         accessToken,
         needsPasswordChange
      }
   })
})

const changePassword = catchAsync(async (req, res) => {
   const { ...passwordData } = req.body;

   const result = await AuthServices.changePassword(req.user, passwordData);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'User changed password successfully',
      data: result
   })
})

const refreshToken = catchAsync(async (req, res) => {
   const { refreshToken } = req.cookies;
   const result = await AuthServices.refreshToken(refreshToken);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Access token is retrived successfully',
      data: result
   })
})

export const AuthControllers = {
   loginUser,
   changePassword,
   refreshToken
}