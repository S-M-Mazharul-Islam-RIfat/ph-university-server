import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";

const getAllAcademicFacultiesFromDB = async () => {
   const result = await AcademicFacultyModel.find();
   return result;
}

const getSingleAcademicFacultyFromDB = async (id: string) => {
   const result = await AcademicFacultyModel.findById(id);
   return result;
}

const createAcademicFacultyIntoDB = async (payLoad: TAcademicFaculty) => {
   const result = await AcademicFacultyModel.create(payLoad);
   return result;
}

const updateAcademicFacultyFromDB = async (id: string, payLoad: Partial<TAcademicFaculty>) => {
   const result = await AcademicFacultyModel.findOneAndUpdate({ _id: id }, payLoad, { new: true });
   return result;
}

export const AcademicFacultyServices = {
   getAllAcademicFacultiesFromDB,
   getSingleAcademicFacultyFromDB,
   createAcademicFacultyIntoDB,
   updateAcademicFacultyFromDB
}