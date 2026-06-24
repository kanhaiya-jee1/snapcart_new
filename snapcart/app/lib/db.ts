import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL

if (!mongodbUrl) {
    throw new Error("MONGODB_URL not set")
}

let cached = (global as unknown as { mongoose: { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null } }).mongoose

if (!cached) {
    cached = (global as unknown as { mongoose: { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null } }).mongoose = { conn: null, promise: null }
}

const connectDb = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongodbUrl, {
            bufferCommands: false,
        })
    }

    try {
        await cached.promise
        cached.conn = mongoose
        return mongoose
    } catch (err) {
        cached.promise = null
        throw err
    }
}

export default connectDb