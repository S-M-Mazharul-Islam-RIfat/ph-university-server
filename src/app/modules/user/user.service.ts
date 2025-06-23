import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemesterModel } from "../academicSemester/academciSemester.model";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import status from "http-status";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { TFaculty } from "../faculty/faculty.interface";
import { FacultyModel } from "../faculty/faculty.model";
import { AdminModel } from "../admin/admin.model";

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
   const userData: Partial<TUser> = {}
   userData.password = password || config.default_password as string;
   userData.role = 'student'
   const admissionSemester = await AcademicSemesterModel.findById(payLoad.admissionSemester)
   userData.id = await generateStudentId(admissionSemester!);
   const session = await mongoose.startSession();
   try {
      session.startTransaction();
      const newUser = await UserModel.create([userData], { session });
      if (!newUser.length) {
         throw new AppError(status.BAD_REQUEST, 'Failed to create user');
      }
      payLoad.id = newUser[0].id;
      payLoad.user = newUser[0]._id;

      const newStudent = await StudentModel.create([payLoad], { session });
      if (!newStudent) {
         throw new AppError(status.BAD_REQUEST, 'Failed to create student');
      }
      await session.commitTransaction();
      await session.endSession();
      return newStudent;

   }
   catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(status.BAD_REQUEST, 'Failed to create user');
   }
}

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
   const userData: Partial<TUser> = {};
   userData.password = password || (config.default_password as string);
   userData.role = 'faculty';
   const academicDepartment = await AcademicDepartmentModel.findById(
      payload.academicDepartment,
   );

   if (!academicDepartment) {
      throw new AppError(status.BAD_REQUEST, 'Academic department not found');
   }

   const session = await mongoose.startSession();

   try {
      session.startTransaction();
      userData.id = await generateFacultyId();

      const newUser = await UserModel.create([userData], { session });
      if (!newUser.length) {
         throw new AppError(status.BAD_REQUEST, 'Failed to create user');
      }

      payload.id = newUser[0].id;
      payload.user = newUser[0]._id;

      const newFaculty = await FacultyModel.create([payload], { session });

      if (!newFaculty.length) {
         throw new AppError(status.BAD_REQUEST, 'Failed to create faculty');
      }

      await session.commitTransaction();
      await session.endSession();

      return newFaculty;
   } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
   }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
   const userData: Partial<TUser> = {};
   userData.password = password || (config.default_password as string);
   userData.role = 'admin';

   const session = await mongoose.startSession();

   try {
      session.startTransaction();
      userData.id = await generateAdminId();
      const newUser = await UserModel.create([userData], { session });


      if (!newUser.length) {
         throw new AppError(status.BAD_REQUEST, 'Failed to create admin');
      }

      payload.id = newUser[0].id;
      payload.user = newUser[0]._id;

      const newAdmin = await AdminModel.create([payload], { session });

      if (!newAdmin.length) {
         throw new AppError(status.BAD_REQUEST, 'Failed to create admin');
      }

      await session.commitTransaction();
      await session.endSession();

      return newAdmin;
   } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
   }
};

export const UserServices = {
   createStudentIntoDB,
   createFacultyIntoDB,
   createAdminIntoDB
}