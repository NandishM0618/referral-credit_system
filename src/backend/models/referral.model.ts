import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
    referrer: mongoose.Types.ObjectId;
    referredUser: mongoose.Types.ObjectId;
    status: "pending" | "converted";
    createdAt: Date;
}

const referralSchema = new Schema<IReferral>({
    referrer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referredUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "converted"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

const Referral = mongoose.model<IReferral>("Referral", referralSchema);

export default Referral
