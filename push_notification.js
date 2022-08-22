import axios from "axios"
import https from "https"

import { getAccessToken } from "./authentication.js"

const PROJECT_ID = "metamorph-2f9b7"
const HOST = "fcm.googleapis.com"

var PATH = `/v1/projects/${PROJECT_ID}/messages:send`

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
            hostname: HOST,
            path: PATH,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + accessToken
            },
        }
        var request = https.request(options, function (resp) {
            resp.setEncoding("utf8");
            resp.on("data", function (data) {
                console.log("Message sent to Firebase for delivery, response:");
                console.log(data);
            })
        })
        request.on("error", function (err) {
            console.log("Unable to send message to Firebase");
            console.log(err);
        })
        request.write(JSON.stringify(commonMessage));
        request.end();
    })
}
