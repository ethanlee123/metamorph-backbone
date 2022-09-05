import axios from "axios"
import axiosRetry from "axios-retry"
import { BaseError } from "./utils/BaseError.js"

axiosRetry(axios, {
    retries: 3, retryDelay: axiosRetry.exponentialDelay, retryCondition: (error) => {
        return error.response.status === 503 || error.response.status === 429
    }
})

function buildCommonMessage(topic, title, body) {
    return {
        'topic': `${topic}`,
        'notification': {
            'title': `${title}`,
            'body': `${body}`,
        }
    }
}

export async function sendWebOrder(webOrderDetails) {      
    var commonMessage = buildCommonMessage(
        webOrderDetails.topic,
        webOrderDetails.title,
        webOrderDetails.body
    )
    console.log(commonMessage)

    getAdmin().messaging().send(commonMessage)
        .then(response => {
            console.log(`Success ${response}`)
            return response
        }, (error) => {
            console.log(`Error sending push notif: ${error}`)
            throw new BaseError(error.message, error.status)
        })
}

export async function sendListOfWebOrders(listOfWebOrderDetails) {
    listOfWebOrderDetails.forEach(webOrder => {
        let webOrderDetails = {
            "title": "New Contract Available",
            "body": "test body",
            "orderNo": webOrder.orderNo,
            "topic": webOrder.topic
        }
        sendWebOrder(webOrderDetails)
    })
}