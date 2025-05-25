import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFaculty.service";
import status from "http-status";

const getAllAcademicFaculties = catchAsync(async (req: Request, res: Response) => {
   const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Get all academic faculty data',
      data: result
   });
});

const getSingleAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
   const { facultyId } = req.params;
   const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Get single academic faculty data',
      data: result
   });
});

const createAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
   const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic faculty is created successfully',
      data: result
   });
});

const updateAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
   const { facultyId } = req.params;
   const result = await AcademicFacultyServices.updateAcademicFacultyFromDB(facultyId, req.body)
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic faculty is updated successfully',
      data: result
   });
})

export const AcademicFacultyControllers = {
   getAllAcademicFaculties,
   getSingleAcademicFaculty,
   createAcademicFaculty,
   updateAcademicFaculty
};

