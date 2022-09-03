import { google } from "googleapis"
import dotenv from "dotenv"
dotenv.config({ path: "./secrets/.env" })

var SCOPES = [
    "https://www.googleapis.com/auth/firebase.messaging"
]

export function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var jwtClient = new google.auth.JWT(
            process.env.CLIENT_EMAIL,
            null,
            process.env.PRIVATE_KEY,
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