import axios from "axios"
import { insertMany, orderNoDoesNotExist } from "./database.js"

const NUMBER_OF_WEB_ORDERS_TO_QUERY = 5

export function getAvailableOrders() {
    var options = {
        headers: {
            'Content-Type': 'application/json',
        },
    }

    var body = {
        "ApplicationId":4,
        "CurrentUserID":null,
        "clientId":null,
        "TranslatorId":null,
        "pageNumber":1,
        "orderMinStatus":3,
        "trgLangId":"1484e197-70f8-4f64-98cf-e0f06eff6f49",
        "cultureId":"jp",
        "pageSize":`${NUMBER_OF_WEB_ORDERS_TO_QUERY}`
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

async function processResponse(response) {
    let topic = "weather"

    let allOrderNos = await getListOfOrderNosFromList(response.data)

    let docs = createPushNotifcationDocument(allOrderNos, topic)
    insertMany(docs)
}

// get list of order numbers from response that do not exist in database
async function getListOfOrderNosFromList(list) {
    var filtered = []
    let allOrderNos = list.map(function(data) {
        let orderNo = data.OrderNo
        return orderNo
    })

    for (let i in allOrderNos) {
        if (await orderNoDoesNotExist(allOrderNos[i])) {
            filtered.push(allOrderNos[i])
        }
    }

    return filtered
}

function createPushNotifcationDocument(orderNos, topic) {
    if (orderNos.length == 0) {
        return []
    }

    return orderNos.map((orderNo) => {
        return {topic: topic, orderNo: orderNo}
    })
}