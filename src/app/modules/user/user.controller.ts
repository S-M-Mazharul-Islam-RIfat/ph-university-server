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

export const userControllers = {
   createStudent
};