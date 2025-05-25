import { Schema, model } from 'mongoose';
import {
   TGuardian,
   TLocalGuardian,
   TStudent,
   TUserName,
} from './student.interface';

const userNameSchema = new Schema<TUserName>({
   firstName: {
      type: String,
      required: [true, 'First name is required.'],
   },
   middleName: {
      type: String,
   },
   lastName: {
      type: String,
      required: [true, 'Last name is required.'],
   },
});

const guardianSchema = new Schema<TGuardian>({
   fatherName: {
      type: String,
      required: [true, 'Father\'s name is required.'],
   },
   fatherOccupation: {
      type: String,
      required: [true, 'Father\'s occupation is required.'],
   },
   fatherContactNo: {
      type: String,
      required: [true, 'Father\'s contact number is required.'],
   },
   motherName: {
      type: String,
      required: [true, 'Mother\'s name is required.'],
   },
   motherOccupation: {
      type: String,
      required: [true, 'Mother\'s occupation is required.'],
   },
   motherContactNo: {
      type: String,
      required: [true, 'Mother\'s contact number is required.'],
   },
});

const localGuradianSchema = new Schema<TLocalGuardian>({
   name: {
      type: String,
      required: [true, 'Local guardian\'s name is required.'],
   },
   occupation: {
      type: String,
      required: [true, 'Local guardian\'s occupation is required.'],
   },
   contactNo: {
      type: String,
      required: [true, 'Local guardian\'s contact number is required.'],
   },
   address: {
      type: String,
      required: [true, 'Local guardian\'s address is required.'],
   },
});

const studentSchema = new Schema<TStudent>({
   id: { type: String },
   name: {
      type: userNameSchema,
      required: [true, 'Name is required.']
   },
   user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required.'],
      unique: true,
      ref: 'User'
   },
   gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required.'],
   },
   dateOfBirth: String,
   email: {
      type: String,
      required: [true, 'Email is required.'],
   },
   contactNo: {
      type: String,
      required: [true, 'Contact number is required.'],
   },
   emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required.'],
   },
   bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
   },
   presentAddress: {
      type: String,
      required: [true, 'Present address is required.'],
   },
   permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required.'],
   },
   guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required.'],
   },
   localGuardian: {
      type: localGuradianSchema,
      required: [true, 'Local guardian information is required.'],
   },
   profileImg: { type: String },
   admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester'
   },
   academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment'
   },
   isDeleted: {
      type: Boolean,
      default: false,
   },
});

export const StudentModel = model<TStudent>('Student', studentSchema);
