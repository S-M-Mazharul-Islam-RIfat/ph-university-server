import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourseRoutes } from "../modules/course/course.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import path from "path";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
   {
      path: '/users',
      route: UserRoutes
   },
   {
      path: '/students',
      route: StudentRoutes
   },
   {
      path: '/faculties',
      route: FacultyRoutes
   },
   {
      path: '/admins',
      route: AdminRoutes
   },
   {
      path: '/academic-semesters',
      route: AcademicSemesterRoutes
   },
   {
      path: '/academic-faculties',
      route: AcademicFacultyRoutes
   },
   {
      path: '/academic-department',
      route: AcademicDepartmentRoutes
   },
   {
      path: '/courses',
      route: CourseRoutes
   },
   {
      path: '/semester-registration',
      route: SemesterRegistrationRoutes
   },
   {
      path: '/offered-courses',
      route: SemesterRegistrationRoutes
   },
   {
      path: '/auth',
      route: AuthRoutes
   }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;