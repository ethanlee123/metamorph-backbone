import { google } from "googleapis"
import key from './secrets/firebase-service-account.json' assert {type: "json"}

var SCOPES = [
    "https://www.googleapis.com/auth/firebase.messaging"
]

export function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        )
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        })
    })
}