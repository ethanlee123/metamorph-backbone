import axios from "axios"
import axiosRetry from "axios-retry"
import { BaseError } from "./utils/BaseError.js"
import { getAdmin } from "./authentication.js"
import { CurrencySymbol } from "./utils/CurrencySymbols.js"
import { formatDate } from "./utils/Time.js"

axiosRetry(axios, {
    retries: 3, retryDelay: axiosRetry.exponentialDelay, retryCondition: (error) => {
        return error.response.status === 503 || error.response.status === 429
    }
})

function buildCommonMessage(webOrder) {
    let topic = webOrder.topic
    let title = `New Contract - Payout ${CurrencySymbol.Yen}${webOrder.translatorPay}`
    let formattedDate = formatDate(webOrder.deliveryDate)
    let body = `Deliver by ${formattedDate}`
    let orderNo = webOrder.orderNo
    
    return {
        'topic': `${topic}`,
        'notification': {
            'title': title,
            'body': body,
        },
        'data': {
            'orderNo': `${orderNo}`
        }
    }
}

export async function sendWebOrder(webOrderDetails) {      
    var commonMessage = buildCommonMessage(webOrderDetails)
    console.log(commonMessage)

    getAdmin().messaging().send(commonMessage)
        .then(response => {
            console.log(`Success sent push notif ${response}`)
            return response
        }, (error) => {
            console.log(`Error sending push notif: ${error}`)
            throw new BaseError(error.message, error.status)
        })
}

export async function sendListOfWebOrders(listOfWebOrderDetails) {
    try {
        listOfWebOrderDetails.forEach(webOrder => {
            sendWebOrder(webOrder)
        })
    } catch(err) {
        console.error(err)
        return err
    }
}