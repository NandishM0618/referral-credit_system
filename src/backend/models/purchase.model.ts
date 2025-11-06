import mongoose, { Schema, Document } from "mongoose";

export interface IPurchase extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    isFirstPurchase: boolean;
    isCredited: boolean;
    createdAt: Date;
}

const purchaseSchema = new Schema<IPurchase>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, default: 0 },
    isFirstPurchase: { type: Boolean, default: false },
    isCredited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Purchase = mongoose.model<IPurchase>("Purchase", purchaseSchema);

export default Purchase;