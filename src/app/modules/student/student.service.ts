import mongoose from "mongoose";
import { StudentModel } from "./student.model";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TStudent } from "./student.interface";
import status from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
   console.log(query);
   const studentQuery = new QueryBuilder(
      StudentModel.find()
         .populate('admissionSemester')
         .populate({
            path: 'academicDepartment',
            populate: {
               path: 'academicFaculty',
            },
         }),
      query,
   )
      .search(studentSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

   const result = await studentQuery.modelQuery;
   return result;
}

const getSingleStudentFromDB = async (id: string) => {
   const result = await StudentModel.findById(id);
   return result;
}

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
   const { name, guardian, localGuardian, ...remainingStudentData } = payload;
   console.log(payload);

   const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingStudentData,
   };

   if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
         modifiedUpdatedData[`name.${key}`] = value;
      }
   }

   if (guardian && Object.keys(guardian).length) {
      for (const [key, value] of Object.entries(guardian)) {
         modifiedUpdatedData[`guardian.${key}`] = value;
      }
   }

   if (localGuardian && Object.keys(localGuardian).length) {
      for (const [key, value] of Object.entries(localGuardian)) {
         modifiedUpdatedData[`localGuardian.${key}`] = value;
      }
   }
   const result = await StudentModel.findByIdAndUpdate(id, modifiedUpdatedData, {
      new: true,
      runValidators: true
   });
   return result;
}

const deleteStudentFromDB = async (id: string) => {
   const session = await mongoose.startSession();
   try {
      session.startTransaction();
      const deletedStudent = await StudentModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true, session });
      if (!deletedStudent) {
         throw new AppError(status.BAD_REQUEST, 'Failed to delete student');
      }

      const userId = deletedStudent.user;
      const deletedUser = await UserModel.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, session });
      if (!deletedUser) {
         throw new AppError(status.BAD_REQUEST, 'Failed to delete user');
      }

      await session.commitTransaction();
      await session.endSession();
      return deletedStudent;
   }
   catch (err) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(status.BAD_REQUEST, 'Failed to delete user');
   }
}

export const StudentServices = {
   getAllStudentsFromDB,
   getSingleStudentFromDB,
   updateStudentIntoDB,
   deleteStudentFromDB
};