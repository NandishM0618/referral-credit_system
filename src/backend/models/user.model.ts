import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    referralCode: string;
    referredBy?: mongoose.Types.ObjectId;
    credits: number;
    createdAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    credits: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
})

userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateAuthToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("jwt secret is not defined in environment variables");
    }
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token
}

const User = mongoose.model<IUser>("User", userSchema)

export default User