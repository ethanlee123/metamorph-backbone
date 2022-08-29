import mongoose from "mongoose"

import dotenv from "dotenv"
dotenv.config({ path: "./secrets/.env" })

const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const mongoDbURI = `mongodb+srv://ethanl:${MONGODB_PASSWORD}@cluster0.wv4nes3.mongodb.net/?retryWrites=true&w=majority`

export async function connectToMongoDb() {
    try {
        await mongoose.connect(mongoDbURI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error(error)
    }
}