import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import { Request, Response } from 'express';

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await AdminServices.getSingleAdminFromDB(id);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin is retrieved succesfully',
      data: result,
   });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
   const result = await AdminServices.getAllAdminsFromDB(req.query);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admins are retrieved succesfully',
      data: result,
   });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const { admin } = req.body;
   const result = await AdminServices.updateAdminIntoDB(id, admin);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin is updated succesfully',
      data: result,
   });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await AdminServices.deleteAdminFromDB(id);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin is deleted succesfully',
      data: result,
   });
});

export const AdminControllers = {
   getAllAdmins,
   getSingleAdmin,
   deleteAdmin,
   updateAdmin,
};