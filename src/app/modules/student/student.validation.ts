import { z } from "zod";

const createUserNameValidationSchema = z.object({
   firstName: z.string(),
   middleName: z.string(),
   lastName: z.string(),
});

const createGuardianValidationSchema = z.object({
   fatherName: z.string(),
   fatherOccupation: z.string(),
   fatherContactNo: z.string().min(10).max(15),
   motherName: z.string(),
   motherOccupation: z.string(),
   motherContactNo: z.string().min(10).max(15),
});

const createLocalGuardianValidationSchema = z.object({
   name: z.string(),
   occupation: z.string(),
   contactNo: z.string().min(10).max(15),
   address: z.string(),
});

const createStudentValidationSchema = z.object({
   body: z.object({
      password: z.string().max(20),
      student: z.object({
         name: createUserNameValidationSchema,
         gender: z.enum(["male", "female"]),
         dateOfBirth: z.string().optional(),
         email: z.string().email(),
         contactNo: z.string().min(10).max(15),
         emergencyContactNo: z.string().min(10).max(15),
         bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
         presentAddress: z.string(),
         permanentAddress: z.string(),
         guardian: createGuardianValidationSchema,
         localGuardian: createLocalGuardianValidationSchema,
         profileImg: z.string().url().optional(),
         admissionSemester: z.string()
      })
   })
});

const updateUserNameValidationSchema = z.object({
   firstName: z.string().optional(),
   middleName: z.string().optional(),
   lastName: z.string().optional(),
});

const updateGuardianValidationSchema = z.object({
   fatherName: z.string().optional(),
   fatherOccupation: z.string().optional(),
   fatherContactNo: z.string().min(10).max(15).optional(),
   motherName: z.string().optional(),
   motherOccupation: z.string().optional(),
   motherContactNo: z.string().min(10).max(15).optional(),
});

const updateLocalGuardianValidationSchema = z.object({
   name: z.string().optional(),
   occupation: z.string().optional(),
   contactNo: z.string().min(10).max(15).optional(),
   address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
   body: z.object({
      student: z.object({
         name: updateUserNameValidationSchema,
         gender: z.enum(["male", "female"]).optional(),
         dateOfBirth: z.string().optional(),
         email: z.string().email().optional(),
         contactNo: z.string().min(10).max(15).optional(),
         emergencyContactNo: z.string().min(10).max(15).optional(),
         bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
         presentAddress: z.string().optional(),
         permanentAddress: z.string().optional(),
         guardian: updateGuardianValidationSchema,
         localGuardian: updateLocalGuardianValidationSchema,
         profileImg: z.string().url().optional(),
         admissionSemester: z.string().optional()
      })
   })
});

export const StudentValidations = {
   createStudentValidationSchema,
   updateStudentValidationSchema
}