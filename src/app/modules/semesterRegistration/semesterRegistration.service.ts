import status from "http-status";
import { AcademicSemesterModel } from "../academicSemester/academciSemester.model";
import { TSemesterRegistration } from "./smesterRegistration.interface"
import AppError from "../../errors/AppError";
import { SemesterRegistrationModel } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";


const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {

   const academicSemester = payload?.academicSemester;

   //check if there any registered semester that is already 'UPCOMING'|'ONGOING'
   const isThereAnyUpcomingOrOngoingSEmester =
      await SemesterRegistrationModel.findOne({
         $or: [
            { status: RegistrationStatus.UPCOMING },
            { status: RegistrationStatus.ONGOING },
         ],
      });

   if (isThereAnyUpcomingOrOngoingSEmester) {
      throw new AppError(
         status.BAD_REQUEST,
         `There is aready an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`,
      );
   }

   // check if the semester is exist
   const isAcademicSemesterExists =
      await AcademicSemesterModel.findById(academicSemester);

   if (!isAcademicSemesterExists) {
      throw new AppError(
         status.NOT_FOUND,
         'This academic semester not found !',
      );
   }

   // check if the semester is already registered!
   const isSemesterRegistrationExists = await SemesterRegistrationModel.findOne({
      academicSemester,
   });

   if (isSemesterRegistrationExists) {
      throw new AppError(
         status.CONFLICT,
         'This semester is already registered!',
      );
   }

   const result = await SemesterRegistrationModel.create(payload);
   return result;
}

const getAllSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {
   const semesterRegistrationQuery = new QueryBuilder(
      SemesterRegistrationModel.find().populate('academicSemester'),
      query
   )
      .filter()
      .sort()
      .paginate()
      .fields();

   const result = await semesterRegistrationQuery.modelQuery;
   return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
   const result = await SemesterRegistrationModel.findById(id);

   return result;
};

const updateSemesterRegistrationIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {
   const isSemesterRegistrationExists = await SemesterRegistrationModel.findById(id);

   if (!isSemesterRegistrationExists) {
      throw new AppError(status.NOT_FOUND, 'This semester is not found !');
   }

   //if the requested semester registration is ended , we will not update anything
   const currentSemesterStatus = isSemesterRegistrationExists?.status;
   const requestedStatus = payload?.status;

   if (currentSemesterStatus === RegistrationStatus.ENDED) {
      throw new AppError(
         status.BAD_REQUEST,
         `This semester is already ${currentSemesterStatus}`,
      );
   }

   // UPCOMING --> ONGOING --> ENDED
   if (
      currentSemesterStatus === RegistrationStatus.UPCOMING &&
      requestedStatus === RegistrationStatus.ENDED
   ) {
      throw new AppError(
         status.BAD_REQUEST,
         `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
      );
   }

   if (
      currentSemesterStatus === RegistrationStatus.ONGOING &&
      requestedStatus === RegistrationStatus.UPCOMING
   ) {
      throw new AppError(
         status.BAD_REQUEST,
         `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
      );
   }

   const result = await SemesterRegistrationModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
   });

   return result;
};

export const SemesterRegistrationService = {
   createSemesterRegistrationIntoDB,
   getAllSemesterRegistrationsFromDB,
   getSingleSemesterRegistrationsFromDB,
   updateSemesterRegistrationIntoDB
}