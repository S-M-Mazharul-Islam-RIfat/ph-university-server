import bcrypt from 'bcrypt';
import { model, Schema } from "mongoose";
import { TUser, UserModelType } from "./user.interface";
import config from '../../config';

const userSchema = new Schema<TUser, UserModelType>({
   id: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      select: 0
   },
   needsPasswordChange: {
      type: Boolean,
      default: true
   },
   passwordChangedAt: {
      type: Date
   },
   role: {
      type: String,
      enum: ['admin', 'student', 'faculty']
   },
   status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress'
   },
   isDeleted: {
      type: Boolean,
      default: false
   }
}, {
   timestamps: true
});

userSchema.pre('save', async function (next) {
   const user = this;
   user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
   )
   next();
});

userSchema.post('save', function (doc, next) {
   doc.password = '';
   next();
})

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
   return await UserModel.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
   return await bcrypt.compare(plainTextPassword, hashedPassword);
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (passwordChangedTimestamp: Date, jwtIssuedTimestamp: number) {
   const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
   return (passwordChangedTime > jwtIssuedTimestamp);
}


export const UserModel = model<TUser, UserModelType>('User', userSchema);