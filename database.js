import { MongoClient } from "mongodb"

import dotenv from "dotenv"
dotenv.config({ path: "./secrets/.env" })

const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const mongoDbURI = `mongodb+srv://ethanl:${MONGODB_PASSWORD}@cluster0.wv4nes3.mongodb.net/?retryWrites=true&w=majority`
export const mongoDbClient = new MongoClient(mongoDbURI)
const metamorphDb = mongoDbClient.db("metamorphdb")

export async function connectToMongoDb() {
    try {
        await mongoDbClient.connect()
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error(error)
    }
}

export async function insertMany(docs) {
    if (docs.length == 0)  {
        return
    }

    try {
        const pushNotifications = metamorphDb.collection("push_notifications")
        const result = await pushNotifications.insertMany(docs)
    } catch (error) {
        console.log(error)
    }
}

export async function orderNoDoesNotExist(orderno) {
    const pushNotifications = metamorphDb.collection("push_notifications")
    let doc = await pushNotifications.findOne({ orderNo: {$eq: orderno} }) 
    return doc == null
}

export async function closeClient() {
    await mongoDbClient.close()
    console.log('Mongo client disconnected')
}