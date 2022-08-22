import axios from "axios"

import { getAccessToken } from "./authentication.js"

const PROJECT_ID = "metamorph-2f9b7"
const FIREBASE_PUSH_NOTIF_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`

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

export function sendWebOrder(webOrderDetails) {
    var commonMessage = buildCommonMessage(
        "weather",
        webOrderDetails.title,
        webOrderDetails.body
    )

    getAccessToken().then(function (accessToken) {
        var options = {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + accessToken
            },
        }

        axios.post(
            FIREBASE_PUSH_NOTIF_URL,
            commonMessage,
            options
        ).then((response) => {
            console.log(response.status)
            console.log(response.data)
        }, (error) => {
            console.log(error)
        })
    })
}
