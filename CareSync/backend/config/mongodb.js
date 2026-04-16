import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("MongoDB Connected Successfully (prescripto)");
    });

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB Connection Error:", err);
    });

    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not found in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.error("Initial MongoDB connection error:", error);
    }
};

export default connectDB;