import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI as string;
        if (!uri) throw new Error("Mongo uri not found in environment");
        await mongoose.connect(uri);
        console.log("mongodb connected successfully")
    } catch (error) {
        console.error("mongodb connection error:", error);
        process.exit(1);
    }
}

export default connectDB