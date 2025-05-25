import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";
import status from "http-status";

const getAllAcademicSemesters = catchAsync(async (req: Request, res: Response) => {
   const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB();
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Get all academic semester data',
      data: result
   });
});

const getSingleAcademicSemesters = catchAsync(async (req: Request, res: Response) => {
   const { semesterId } = req.params;
   const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Get single academic semester data',
      data: result
   });
});

const createAcademicSemester = catchAsync(async (req: Request, res: Response) => {
   const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body)
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic semester is created successfully',
      data: result
   });
});

const updateAcademicSemester = catchAsync(async (req: Request, res: Response) => {
   const { semesterId } = req.params;
   const result = await AcademicSemesterServices.updateAcademicSemesterFromDB(semesterId, req.body)
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic semester is updated successfully',
      data: result
   });
});

export const AcademicSemesterControllers = {
   getAllAcademicSemesters,
   getSingleAcademicSemesters,
   createAcademicSemester,
   updateAcademicSemester
};

