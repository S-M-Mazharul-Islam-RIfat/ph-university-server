import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from './academicDepartment.service';
import status from "http-status";

const getAllAcademicDepartments = catchAsync(async (req: Request, res: Response) => {
   const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Get all academic department data',
      data: result
   });
});

const getSingleAcademicDepartment = catchAsync(async (req: Request, res: Response) => {
   const { departmentId } = req.params;
   const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Get single academic department data',
      data: result
   });
});

const createAcademicDepartment = catchAsync(async (req: Request, res: Response) => {
   const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic department is created successfully',
      data: result
   });
});

const updateAcademicDepartment = catchAsync(async (req: Request, res: Response) => {
   const { departmentId } = req.params;
   const result = await AcademicDepartmentServices.updateAcademicDepartmentFromDB(departmentId, req.body)
   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Academic department is updated successfully',
      data: result
   });
})

export const AcademicDepartmentControllers = {
   getAllAcademicDepartments,
   getSingleAcademicDepartment,
   createAcademicDepartment,
   updateAcademicDepartment
};

