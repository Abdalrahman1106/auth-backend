import {UserModel} from '../models/user.js';
import {hashPassword , comparePassword} from '../utils/hash.js';
import { AppError } from '../utils/AppError.js';


type RegisterInput = {
    name: string;
    email: string;
    password: string;
};

export async function registerUser(input: RegisterInput) {
    const existingUser = await UserModel.findOne({ email: input.email });
    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await hashPassword(input.password);

    const user = await UserModel.create({
        name: input.name,
        email: input.email,
        passwordHash: passwordHash,
    });
    return user;
}




type LoginInput = {
    email: string;
    password: string;
}


export async function loginUser(input: LoginInput) {
    const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password",401);
    }
    return user;
}
