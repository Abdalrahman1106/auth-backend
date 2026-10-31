import {Schema, model, InferSchemaType} from 'mongoose';


const userSchema = new Schema({
  name: {type: String, required: true , trim: true , minlength: 2, maxlength: 50},
  email: {type: String, required: true, unique: true , trim: true , lowercase: true},
  passwordHash: {type: String, required: true , select: false},
  passwordResetToken:{type:String,default:undefined},
  passwordResetExpires:{type:Date,default:undefined},
  role: {type: String, enum: ['user', 'admin'], default: 'user'},
  isEmailVerified: {type: Boolean, default: false},},
{
  timestamps: true,

},
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model<User>('User', userSchema);

    

