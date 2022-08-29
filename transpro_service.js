import axios from "axios"

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
        "pageSize":"3"
    }

    axios.post(
        "https://bcause-api.com/order/getWebOrders",
        body,
        options
    ).then((response) => {
        // Get collection of users

        // iterate through collection of users
        // if orderNo is not found isn sent web orders collection, then add this orderNo to it
        // AND send this push notif

        // else pass
        

        //Store in database, collection specific to user


        // console.log(response)
    }, (error) => {
        console.log("Error sending push notif")
        return error
    })
}