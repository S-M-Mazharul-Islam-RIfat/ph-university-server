import { Types } from "mongoose";

export type TUserName = {
   firstName: string;
   middleName: string;
   lastName: string;
};

export type TGuardian = {
   fatherName: string;
   fatherOccupation: string;
   fatherContactNo: string;
   motherName: string;
   motherOccupation: string;
   motherContactNo: string;
};

export type TLocalGuardian = {
   name: string;
   occupation: string;
   contactNo: string;
   address: string;
};

export type TStudent = {
   id: string;
   user: Types.ObjectId;
   name: TUserName;
   gender: 'male' | 'female' | 'other';
   dateOfBirth: string;
   email: string;
   contactNo: string;
   emergencyContactNo: string;
   bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
   presentAddress: string;
   permanentAddress: string;
   guardian: TGuardian;
   localGuardian: TLocalGuardian;
   profileImg?: string;
   admissionSemester: Types.ObjectId;
   academicDepartment: Types.ObjectId;
   isDeleted: boolean;
};