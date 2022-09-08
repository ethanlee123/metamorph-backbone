
/**
 *  Understanding underlying implementation of classes
 *  https://www.freecodecamp.org/news/a-beginners-guide-to-javascripts-prototype/
 */

export class WebOrder {
    constructor(topic, orderNo, deliveryDate, translatorPay) {
        this.topic = topic
        this.orderNo = orderNo
        this.deliveryDate = deliveryDate
        this.translatorPay = translatorPay
    }

    // TODO: implement formatting
    formattedDeliveryDate() {
        return this.deliveryDate
    }
}
