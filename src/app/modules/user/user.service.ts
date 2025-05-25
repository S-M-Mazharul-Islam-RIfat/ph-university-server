import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemesterModel } from "../academicSemester/academciSemester.model";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";
import { generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import status from "http-status";

const createStudentIntoDB = async (password: string, payLoad: TStudent) => {
   const userData: Partial<TUser> = {}
   userData.password = password || config.default_password as string;
   userData.role = 'student'
   const admissionSemester = await AcademicSemesterModel.findById(payLoad.admissionSemester)
   userData.id = await generateStudentId(admissionSemester as TAcademicSemester);
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

export const UserServices = {
   createStudentIntoDB
}