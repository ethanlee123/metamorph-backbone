import express from "express"

import { sendWebOrder } from "./push_notification.js"
import { getAvailableOrders } from "./transpro_service.js"
import { connectToMongoDb, closeClient, getLatestPushedNotifications } from "./database.js"

const app = express()
const PORT = 3000  
const ONE_MINUTE_IN_MS = 10 * 1000

app.use(express.json())

app.post("/test", (req, res) => {
    res.json({
        Response: "NodeJs script is working"
    })
})

app.post("/send_push_notification", (req, res) => {
    let orderNo = req.body.orderNo
    let topic = req.body.topic
    let webOrderDetails = {
        "title": "New Contract Available",
        "body": "test body",
        "orderNo": orderNo,
        "topic": topic
    }

    sendWebOrder(webOrderDetails)

    res.send("Sent push notification")
})

app.get("/received_push_notifications", async (_, res) => {
    const pushNotifications = await getLatestPushedNotifications()
    
    res.json(pushNotifications)
})

process.once('SIGUSR2', 
    function() {
        process.kill(process.pid, 'SIGUSR2')
    }
)

process.on('SIGINT', function () {
    closeMongoDbClient()
})

async function closeMongoDbClient() {
    // close mongodb client when killing the app
    await closeClient()
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGKILL');
}

async function main() {
    await connectToMongoDb()
// setInterval(function() {
	getAvailableOrders()
// }, ONE_MINUTE_IN_MS)
}

main()

app.listen(PORT, () => {
    console.log(`Server started ${PORT}`)
})