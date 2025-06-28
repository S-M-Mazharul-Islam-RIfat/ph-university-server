import status from "http-status";
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model";
import { AcademicFacultyModel } from "../academicFaculty/academicFaculty.model";
import AppError from "../../errors/AppError";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { CourseModel } from "../course/course.model";
import { FacultyModel } from "../faculty/faculty.model";
import { OfferedCourseModel } from "./offeredCourse.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { TOfferedCourse } from "./offeredCourse.interface";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
   const {
      semesterRegistration,
      academicFaculty,
      academicDepartment,
      course,
      section,
      faculty,
      days,
      startTime,
      endTime,
   } = payload;


   //check if the semester registration id is exists!
   const isSemesterRegistrationExits =
      await SemesterRegistrationModel.findById(semesterRegistration);

   if (!isSemesterRegistrationExits) {
      throw new AppError(
         status.NOT_FOUND,
         'Semester registration not found !',
      );
   }

   const academicSemester = isSemesterRegistrationExits.academicSemester;

   const isAcademicFacultyExits =
      await AcademicFacultyModel.findById(academicFaculty);

   if (!isAcademicFacultyExits) {
      throw new AppError(status.NOT_FOUND, 'Academic Faculty not found !');
   }

   const isAcademicDepartmentExits =
      await AcademicDepartmentModel.findById(academicDepartment);

   if (!isAcademicDepartmentExits) {
      throw new AppError(status.NOT_FOUND, 'Academic Department not found !');
   }

   const isCourseExits = await CourseModel.findById(course);

   if (!isCourseExits) {
      throw new AppError(status.NOT_FOUND, 'Course not found !');
   }

   const isFacultyExits = await FacultyModel.findById(faculty);

   if (!isFacultyExits) {
      throw new AppError(status.NOT_FOUND, 'Faculty not found !');
   }

   // check if the department is belong to the faculty
   const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
      _id: academicDepartment,
      academicFaculty,
   });

   if (!isDepartmentBelongToFaculty) {
      throw new AppError(
         status.BAD_REQUEST,
         `This ${isAcademicDepartmentExits.name} is not  belong to this ${isAcademicFacultyExits.name}`,
      );
   }

   // check if the same offered course same section in same registered semester exists

   const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
      await OfferedCourseModel.findOne({
         semesterRegistration,
         course,
         section,
      });

   if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
      throw new AppError(
         status.BAD_REQUEST,
         `Offered course with same section is already exist!`,
      );
   }

   // get the schedules of the faculties
   const assignedSchedules = await OfferedCourseModel.find({
      semesterRegistration,
      faculty,
      days: { $in: days },
   }).select('days startTime endTime');

   const newSchedule = {
      days,
      startTime,
      endTime,
   };

   if (hasTimeConflict(assignedSchedules, newSchedule)) {
      throw new AppError(
         status.CONFLICT,
         `This faculty is not available at that time ! Choose other time or day`,
      );
   }

   const result = await OfferedCourseModel.create({
      ...payload,
      academicSemester,
   });
   return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
   const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();

   const result = await offeredCourseQuery.modelQuery;
   return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
   const offeredCourse = await OfferedCourseModel.findById(id);

   if (!offeredCourse) {
      throw new AppError(status.NOT_FOUND, 'Offered Course not found');
   }

   return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
   id: string,
   payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {

   const { faculty, days, startTime, endTime } = payload;

   const isOfferedCourseExists = await OfferedCourseModel.findById(id);

   if (!isOfferedCourseExists) {
      throw new AppError(status.NOT_FOUND, 'Offered course not found !');
   }

   const isFacultyExists = await FacultyModel.findById(faculty);

   if (!isFacultyExists) {
      throw new AppError(status.NOT_FOUND, 'Faculty not found !');
   }

   const semesterRegistration = isOfferedCourseExists.semesterRegistration;


   // Checking the status of the semester registration
   const semesterRegistrationStatus =
      await SemesterRegistrationModel.findById(semesterRegistration);

   if (semesterRegistrationStatus?.status !== 'UPCOMING') {
      throw new AppError(
         status.BAD_REQUEST,
         `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
      );
   }

   // check if the faculty is available at that time.
   const assignedSchedules = await OfferedCourseModel.find({
      semesterRegistration,
      faculty,
      days: { $in: days },
   }).select('days startTime endTime');

   const newSchedule = {
      days,
      startTime,
      endTime,
   };

   if (hasTimeConflict(assignedSchedules, newSchedule)) {
      throw new AppError(
         status.CONFLICT,
         `This faculty is not available at that time ! Choose other time or day`,
      );
   }

   const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
      new: true,
   });
   return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {

   const isOfferedCourseExists = await OfferedCourseModel.findById(id);

   if (!isOfferedCourseExists) {
      throw new AppError(status.NOT_FOUND, 'Offered Course not found');
   }

   const semesterRegistation = isOfferedCourseExists.semesterRegistration;

   const semesterRegistrationStatus =
      await SemesterRegistrationModel.findById(semesterRegistation).select('status');

   if (semesterRegistrationStatus?.status !== 'UPCOMING') {
      throw new AppError(
         status.BAD_REQUEST,
         `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
      );
   }

   const result = await OfferedCourseModel.findByIdAndDelete(id);

   return result;
};

export const OfferedCourseServices = {
   createOfferedCourseIntoDB,
   getAllOfferedCoursesFromDB,
   getSingleOfferedCourseFromDB,
   deleteOfferedCourseFromDB,
   updateOfferedCourseIntoDB,
};