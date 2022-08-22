import { sendNotification } from "./push_notification.js"
import express from "express"

const app = express()

const PORT = 3000
  

app.use(express.json())
  
// post request
// what data needs to be sent through body?
    // should i sent data through body?

// ASK jason what type of 
// send push notif to app and with data
// how to setup a RPI
app.post("/push_notification_web_order_details", (req, res) => {
    const { webOrderDetails }  = req.body

    let title = "this is notif title"
    let body = "this is notif body"
    let orderNo = webOrderDetails.orderNo

    sendNotification()

    res.json({
        orderNo : orderNo,
        title: title,
        body: body
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

sendNotification()