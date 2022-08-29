import express from "express"

import { sendWebOrder } from "./push_notification.js"
import { getAvailableOrders } from "./transpro_service.js"
import { connectToMongoDb } from "./database.js"

const app = express()
const PORT = 3000  

app.use(express.json())

setInterval(function() {
	getAvailableOrders()
}, 10 * 1000)
  
app.post("/test", (req, res) => {
    res.json({
        Response: "NodeJs script is working"
    })
})

process.once('SIGUSR2', 
    function() {
        process.kill(process.pid, 'SIGUSR2')
    }
)

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGKILL');
})

connectToMongoDb()

app.listen(PORT, () => {
    console.log(`Server started ${PORT}`)
})