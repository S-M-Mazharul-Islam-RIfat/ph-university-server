import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await FacultyServices.getSingleFacultyFromDB(id);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty is retrieved succesfully',
      data: result,
   });
});

const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
   console.log(req.user);
   const result = await FacultyServices.getAllFacultiesFromDB(req.query);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties are retrieved succesfully',
      data: result,
   });
});

const updateFaculty = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const { faculty } = req.body;
   const result = await FacultyServices.updateFacultyIntoDB(id, faculty);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty is updated succesfully',
      data: result,
   });
});

const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await FacultyServices.deleteFacultyFromDB(id);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty is deleted succesfully',
      data: result,
   });
});

export const FacultyControllers = {
   getAllFaculties,
   getSingleFaculty,
   deleteFaculty,
   updateFaculty,
};