import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartmentModel } from "./academicDepartment.model";

const getAllAcademicDepartmentsFromDB = async () => {
   const result = await AcademicDepartmentModel.find();
   return result;
}

const getSingleAcademicDepartmentFromDB = async (id: string) => {
   const result = await AcademicDepartmentModel.findById(id);
   return result;
}

const createAcademicDepartmentIntoDB = async (payLoad: TAcademicDepartment) => {
   const result = await AcademicDepartmentModel.create(payLoad);
   return result;
}

const updateAcademicDepartmentFromDB = async (id: string, payLoad: Partial<TAcademicDepartment>) => {
   const result = await AcademicDepartmentModel.findOneAndUpdate({ _id: id }, payLoad, { new: true });
   return result;
}

export const AcademicDepartmentServices = {
   getAllAcademicDepartmentsFromDB,
   getSingleAcademicDepartmentFromDB,
   createAcademicDepartmentIntoDB,
   updateAcademicDepartmentFromDB
}