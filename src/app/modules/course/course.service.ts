import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCoursefaculty } from "./course.interface";
import { CourseFacultyModel, CourseModel } from "./course.model"
import AppError from "../../errors/AppError";
import status from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
   const result = await CourseModel.create(payload);
   return result;
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
   const courseQuery = new QueryBuilder(CourseModel.find().populate('preRequisiteCourses.course'), query)
      .search(CourseSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields()
   const result = await courseQuery.modelQuery;
   return result;
}

const getSingleCourseFromDB = async (id: string) => {
   const result = await CourseModel.findById(id).populate('preRequisiteCourses.course');
   return result;
}

const updateCourse = async (id: string, payload: Partial<TCourse>) => {
   const { preRequisiteCourses, ...courseRemainingData } = payload;

   const session = await mongoose.startSession();

   try {
      session.startTransaction();

      const updatedBasicCourseInfo = await CourseModel.findByIdAndUpdate(id, courseRemainingData, { new: true, runValidators: true, session });

      if (!updatedBasicCourseInfo) {
         throw new AppError(status.BAD_REQUEST, 'Failed to update course');
      }

      if (preRequisiteCourses && preRequisiteCourses.length > 0) {
         const deletedPreRequisities = preRequisiteCourses.filter(el => el.course && el.isDeleted).map(el => el.course);
         const deletedPreRequistieCourses = await CourseModel.findByIdAndUpdate(id, { $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisities } } } }, {
            new: true,
            runValidators: true,
            session
         });

         if (!deletedPreRequistieCourses) {
            throw new AppError(status.BAD_REQUEST, 'Failed to update course');
         }

         const newPreRequisite = preRequisiteCourses?.filter(el => el.course && !el.isDeleted);
         const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(id, { $addToSet: { preRequisiteCourses: { $each: newPreRequisite } } }, {
            new: true,
            runValidators: true,
            session
         });

         if (!newPreRequisiteCourses) {
            throw new AppError(status.BAD_REQUEST, 'Failed to update course');
         }

         await session.commitTransaction();
         await session.endSession();
      }

      const result = await CourseModel.findById(id).populate('preRequisiteCourses.course')
      return result;
   }
   catch {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(status.BAD_REQUEST, 'Failed to update course');
   }

}

const deleteCourseFromDB = async (id: string) => {
   const result = await CourseModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
   return result;
}

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCoursefaculty>) => {
   const result = await CourseFacultyModel.findByIdAndUpdate(id, {
      $addToSet: { faculties: { $each: payload } }
   }, { upsert: true, new: true });

   return result;
}

export const CourseServices = {
   createCourseIntoDB,
   getAllCoursesFromDB,
   getSingleCourseFromDB,
   updateCourse,
   deleteCourseFromDB,
   assignFacultiesWithCourseIntoDB
}