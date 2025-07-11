import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();
router.get('/', auth(USER_ROLE.admin), AcademicSemesterControllers.getAllAcademicSemesters);
router.get('/:semesterId', AcademicSemesterControllers.getSingleAcademicSemesters);
router.post('/create-academic-semester', validateRequest(academicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester);
router.patch('/:semesterId', validateRequest(academicSemesterValidations.updateAcademicSemesterValidationSchema), AcademicSemesterControllers.updateAcademicSemester)

export const AcademicSemesterRoutes = router;