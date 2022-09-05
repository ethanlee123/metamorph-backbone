import { MongoClient } from "mongodb"

import dotenv from "dotenv"
dotenv.config({ path: "./secrets/.env" })

const MONGODBURI = process.env.MONGODB_DB_URI
export const mongoDbClient = new MongoClient(MONGODBURI)
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
    if (docs.length == 0) {
        return
    }

    try {
        const pushNotifications = metamorphDb.collection("push_notifications")
        const result = await pushNotifications.insertMany(docs)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function orderNoDoesNotExist(orderno) {
    try {
        const pushNotifications = metamorphDb.collection("push_notifications")
        let doc = await pushNotifications.findOne({ orderNo: { $eq: orderno } })
        return doc == null
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function closeClient() {
    await mongoDbClient.close()
    console.log('Mongo client disconnected')
}

export async function getLatestPushedNotifications() {
    try {
        const pushNotifications = metamorphDb.collection("push_notifications")
        const result = await pushNotifications.find()
            .sort({ $natural: -1 }) // sort from most recently inserted to oldest
            .limit(50)
            .toArray()

        return result
    } catch (error) {
        console.log(error)
        return error
    }
}