import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
router.get('/', StudentControllers.getAllStudents);
router.get('/:id', StudentControllers.getSingleStudent);
router.patch('/:id', StudentControllers.updateStudent);
router.delete('/:id', StudentControllers.deleteStudent)

export const StudentRoutes = router;