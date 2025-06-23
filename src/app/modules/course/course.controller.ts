import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import catchAsync from '../../utils/catchAsync';
import status from 'http-status';
import { Request, Response } from 'express';

const createCourse = catchAsync(async (req: Request, res: Response) => {
   const result = await CourseServices.createCourseIntoDB(req.body);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Course is created succesfully',
      data: result,
   });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
   const result = await CourseServices.getAllCoursesFromDB(req.query);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Course are retrieved successfully',
      data: result,
   });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await CourseServices.getSingleCourseFromDB(id);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Course is retrieved succesfully',
      data: result,
   });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await CourseServices.updateCourse(id, req.body);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Course is updated succesfully',
      data: result,
   });
});


const deleteCourse = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await CourseServices.deleteCourseFromDB(id);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Course is deleted succesfully',
      data: result,
   });
});


const assignFacultiesWithCourse = catchAsync(async (req: Request, res: Response) => {
   const { courseId } = req.params;
   const { faculties } = req.body;
   const result = await CourseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);

   sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Faculty is assigned succesfully',
      data: result,
   });
});



export const CourseControllers = {
   createCourse,
   getSingleCourse,
   getAllCourses,
   updateCourse,
   deleteCourse,
   assignFacultiesWithCourse
};