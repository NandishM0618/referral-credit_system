import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    referralCode: string;
    referredBy?: mongoose.Types.ObjectId;
    credits: number;
    createdAt: Date;
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

const User = mongoose.model<IUser>("User", userSchema)

export default User