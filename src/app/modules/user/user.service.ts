import config from "../../config";
import { TStudent } from "../student/student.interface";
import { StudentModel } from "../student/student.model";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
   const userData: Partial<TUser> = {}
   userData.password = password || config.default_password as string;
   userData.role = 'student'
   userData.id = '2030100001'

   const newUser = await UserModel.create(userData);
   if (Object.keys(newUser).length) {
      studentData.id = newUser.id;
      studentData.user = newUser._id;

      const newStudent = await StudentModel.create(studentData);
      return newStudent;
   }
}

export const UserServices = {
   createStudentIntoDB
}