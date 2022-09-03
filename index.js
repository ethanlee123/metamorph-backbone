import express from "express"
import dotenv from "dotenv"
import path from "path"

import { sendWebOrder } from "./push_notification.js"
import { getAvailableOrders } from "./transpro_service.js"
import { connectToMongoDb, closeClient, getLatestPushedNotifications } from "./database.js"
import { BaseError } from "./utils/BaseError.js"
import httpStatusCodes from "./utils/httpStatusCodes.js"
import { logError, returnError } from "./utils/ErrorHandler.js"

dotenv.config({ path: "./secrets/.env" })

const app = express()
const PORT = process.env.PORT || 3000
const ONE_MINUTE_IN_MS = 60 * 1000
const router = express.Router()

app.use(express.json())
app.use("/", router)
app.use(logError)
app.use(returnError)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(404).json({
        success: 0,
        message: err.message,
        stack: err.stack
    })
})

router.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve() + "/index.html"))
})

router.post("/test", (req, res) => {
    res.json({
        Response: "NodeJs script is working"
    })
})

router.post("/send_push_notification", (req, res, next) => {
    try {
        let orderNo = req.body.orderNo
        let topic = req.body.topic
        let webOrderDetails = {
            "title": "New Contract Available",
            "body": "test body",
            "orderNo": orderNo,
            "topic": topic
        }
        
        sendWebOrder(webOrderDetails)
        res.send({
            status: httpStatusCodes.OK_POST,
            message: "Successfully send push notif"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/received_push_notifications", async (_, res) => {
    const pushNotifications = await getLatestPushedNotifications()

    res.json(pushNotifications)
})

router.all("*", (req, res, next) => {
    const err = new BaseError(`Requested URL ${req.path} not found.`, httpStatusCodes.NOT_FOUND)
    next(err)
})


async function closeMongoDbClient() {
    // close mongodb client when killing the app
    await closeClient()
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGKILL');
}

async function main() {
    await connectToMongoDb()
    setInterval(function() {
        getAvailableOrders()
    }, ONE_MINUTE_IN_MS)
}


app.listen(PORT, () => {
    main()
    console.log(`Server started ${PORT}`)
})

process.once('SIGUSR2',
    function () {
        process.kill(process.pid, 'SIGUSR2')
    }
)

process.on('SIGINT', function () {
    closeMongoDbClient()
})
