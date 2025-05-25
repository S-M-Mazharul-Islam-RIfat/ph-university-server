import { z } from "zod";

const createAcademicFacultyValidationSchema = z.object({
   body: z.object({
      name: z.
         string({
            invalid_type_error: 'Academic faculty must be string'
         })
         .max(40, { message: 'Faculty name cannot be more than 20 characters' })
   })
});

const updateAcademicFacultyValidationSchema = z.object({
   body: z.object({
      name: z.
         string({
            invalid_type_error: 'Academic faculty must be string'
         })
         .max(40, { message: 'Faculty name cannot be more than 20 characters' })
         .optional()
   })
})

export const AcademicFacultyValidations = {
   createAcademicFacultyValidationSchema,
   updateAcademicFacultyValidationSchema
}