import axios from "axios"
import axiosRetry from "axios-retry"

import { getAccessToken } from "./authentication.js"
import { BaseError } from "./utils/BaseError.js"

const PROJECT_ID = "metamorph-2f9b7"
const FIREBASE_PUSH_NOTIF_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay, retryCondition: (error) => {
    return error.response.status === 503 || error.response.status === 429
} })

function buildCommonMessage(topic, title, body) {
    return {
        'message': {
            'topic': `${topic}`,
            'notification': {
                'title': `${title}`,
                'body': `${body}`,
            }
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

    getAccessToken().then((accessToken) => {
        var options = {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + accessToken
            }
        }

        axios.post(
            FIREBASE_PUSH_NOTIF_URL,
            commonMessage,
            options
        ).then((response) => {
            return "Successfully sent push notif"
        }, (error) => {
            console.log(`Error sending push notif: ${error}`)
            throw new BaseError(error.message, error.status)
        })
    }, (error) => {
        console.log(`Error getting access token: ${error}`)
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