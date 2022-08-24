import { sendWebOrder } from "./push_notification.js"
import express from "express"

const app = express()

const PORT = 3000
  

app.use(express.json())
  
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


app.listen(PORT, () => {
    console.log(`Server started ${PORT}`)
})