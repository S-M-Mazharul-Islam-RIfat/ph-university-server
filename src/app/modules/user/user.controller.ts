import { Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";

const createStudent = catchAsync(async (req: Request, res: Response) => {
   const { password, student: studentData } = req.body;
   const result = await UserServices.createStudentIntoDB(password, studentData);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student is created successfully',
      data: result
   });
});

const createFaculty = catchAsync(async (req: Request, res: Response) => {
   const { password, faculty: facultyData } = req.body;

   const result = await UserServices.createFacultyIntoDB(password, facultyData);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Faculty is created succesfully',
      data: result,
   });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
   const { password, admin: adminData } = req.body;

   const result = await UserServices.createAdminIntoDB(password, adminData);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Admin is created succesfully',
      data: result,
   });
});

export const userControllers = {
   createStudent,
   createFaculty,
   createAdmin
};