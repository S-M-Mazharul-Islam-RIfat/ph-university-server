import status from "http-status";
import AppError from "../../errors/AppError";
import { AcademicSemesterModel } from "./academciSemester.model";
import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";

const getAllAcademicSemestersFromDB = async () => {
   const result = await AcademicSemesterModel.find();
   return result;
}

const getSingleAcademicSemesterFromDB = async (id: string) => {
   const result = await AcademicSemesterModel.findById(id);
   return result;
}

const createAcademicSemesterIntoDB = async (payLoad: TAcademicSemester) => {
   if (academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
      throw new Error('Invalid Semester Code');
   }
   const result = await AcademicSemesterModel.create(payLoad);
   return result;
}

const updateAcademicSemesterFromDB = async (id: string, payLoad: Partial<TAcademicSemester>) => {
   if (payLoad.name && payLoad.code && academicSemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
      throw new AppError(status.BAD_REQUEST, 'Invalid Semester Code');
   }

   const result = await AcademicSemesterModel.findByIdAndUpdate({ _id: id }, payLoad, { new: true });
   return result;
}

export const AcademicSemesterServices = {
   getAllAcademicSemestersFromDB,
   getSingleAcademicSemesterFromDB,
   createAcademicSemesterIntoDB,
   updateAcademicSemesterFromDB
};