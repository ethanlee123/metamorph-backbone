import axios from "axios"
import { insertMany, orderNoDoesNotExist } from "./database.js"
import { sendListOfWebOrders, sendWebOrder } from "./push_notification.js"
import { WebOrder } from "./models/WebOrder.js"

const NUMBER_OF_WEB_ORDERS_TO_QUERY = 5

export function getAvailableOrders() {
    var options = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    var body = {
        "ApplicationId": 4,
        "CurrentUserID": null,
        "clientId": null,
        "TranslatorId": null,
        "pageNumber": 1,
        "orderMinStatus": 3,
        "trgLangId": "1484e197-70f8-4f64-98cf-e0f06eff6f49",
        "cultureId": "jp",
        "pageSize": `${NUMBER_OF_WEB_ORDERS_TO_QUERY}`
    }

    axios.post(
        "https://bcause-api.com/order/getWebOrders",
        body,
        options
    ).then((response) => {
        console.log("Processing web orders")
        processResponse(response)
    }, (error) => {
        console.log("Error sending push notif")
        return error
    })
}

// Process response with weather push notif topic
async function processResponse(response) {
    let topic = "weather"

    let allWebOrders = await getListOfOrderNosFromList(response.data, topic)
    let newWebOrdersOnly = await filterOutExistingOrderNumbers(allWebOrders)

    let docs = createPushNotifcationDocument(newWebOrdersOnly)
    insertMany(docs)
    sendListOfWebOrders(docs)
}

// Get list of order numbers, delivery date, translator pay from list parameter
async function getListOfOrderNosFromList(list, topic) {
    let allWebOrders = list.map(function (data) {
        let webOrder = new WebOrder(topic, data.OrderNo, data.DeliveryDate, data.PaymentAmount)
        return webOrder
    })
    return allWebOrders
}

async function filterOutExistingOrderNumbers(webOrders) {
    var filtered = []
    for (let i in webOrders) {
        if (await orderNoDoesNotExist(webOrders[i].orderNo)) {
            filtered.push(webOrders[i])
        }
    }

    return filtered
}

function createPushNotifcationDocument(webOrders, topic) {
    if (webOrders.length == 0) {
        return []
    }

    return webOrders.map((webOrder) => {
        return { 
            topic: webOrder.topic, 
            orderNo: webOrder.orderNo, 
            deliveryDate: webOrder.deliveryDate, 
            translatorPay: webOrder.translatorPay 
        }
    })
}