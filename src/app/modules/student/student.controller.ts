import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
   const result = await StudentServices.getAllStudentsFromDB();
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Student is retrive successfully',
      data: result
   });
})

const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
   const { studentId } = req.params;
   const result = await StudentServices.getSingleStudentFromDB(studentId);
   res.status(200).json({
      success: true,
      message: 'Student is retrive successfully',
      data: result
   })
})

const updateStudent = catchAsync(async (req: Request, res: Response) => {
   const { studentId } = req.params;
   const { student } = req.body;
   const result = await StudentServices.updateStudentIntoDB(studentId, student);
   res.status(200).json({
      success: true,
      message: 'Student is updated successfully',
      data: result
   })
})

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
   const { studentId } = req.params;
   const result = await StudentServices.deleteStudentFromDB(studentId);
   res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: result
   })
})

export const StudentControllers = {
   getAllStudents,
   getSingleStudent,
   updateStudent,
   deleteStudent
}