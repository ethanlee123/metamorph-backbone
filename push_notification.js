import axios from "axios"
import https from "https"
import key from './secrets/firebase-service-account.json' assert {type: "json"}
import { google } from "googleapis"

const PROJECT_ID = "metamorph-2f9b7"
const HOST = "fcm.googleapis.com"
var PATH = `/v1/projects/${PROJECT_ID}/messages:send`
var SCOPES = [
    "https://www.googleapis.com/auth/firebase.messaging"
  ];

function getAccessToken() {
    return new Promise(function(resolve, reject) {
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize(function(err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
   });
}

function buildCommonMessage() {
    return {
      'message': {
        'topic': 'weather',
        'notification': {
          'title': 'FCM Notification',
          'body': 'Notification from FCM',
        }
      }
    };
  }

export function sendNotification() {
    getAccessToken().then(function(accessToken) {
        var options = {
            hostname: HOST,
            path: PATH,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + accessToken
            },
        };
        var request = https.request(options, function(resp) {
            resp.setEncoding("utf8");
            resp.on("data", function(data) {
                console.log("Message sent to Firebase for delivery, response:");
                console.log(data);
            });
        });
        request.on("error", function(err) {
            console.log("Unable to send message to Firebase");
            console.log(err);
        });
        request.write(JSON.stringify(buildCommonMessage()));
        request.end();
    });
}
