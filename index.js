import { sendWebOrder } from "./push_notification.js"
import express from "express"

const app = express()

const PORT = 3000
  

app.use(express.json())
  
app.post("/push_notification_web_order_details", (req, res) => {
    const { webOrderDetails }  = req.body

    sendWebOrder(webOrderDetails)

    res.json({
        body: webOrderDetails.body
    })
})

process.once('SIGUSR2', 
    function() {
        process.kill(process.pid, 'SIGUSR2')
    }
)

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
})


app.listen(PORT, () => {
    console.log(`Server started ${PORT}`)
})