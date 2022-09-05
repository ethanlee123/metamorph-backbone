import { google } from "googleapis"
import dotenv from "dotenv"
import admin from "firebase-admin"
dotenv.config({ path: "./secrets/.env" })

var SCOPES = [
    "https://www.googleapis.com/auth/firebase.messaging"
]

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS))
})

export function getAdmin() {
    return firebaseAdmin
}

export function getAccessToken() {
    return new Promise(function (resolve, reject) {
        var jwtClient = new google.auth.JWT(
            process.env.CLIENT_EMAIL,
            null,
            process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
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