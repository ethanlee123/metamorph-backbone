
/**
 *  Understanding underlying implementation of classes
 *  https://www.freecodecamp.org/news/a-beginners-guide-to-javascripts-prototype/
 */

export class WebOrder {
    constructor(topic, orderNo, deliveryDate, translatorPay, translatorFee, orderStatusName, webOrderTitle, deliveryPlan) {
        this.topic = topic
        this.orderNo = orderNo
        this.deliveryDate = deliveryDate
        this.translatorPay = translatorPay
        this.translatorFee = translatorFee
        this.orderStatusName = orderStatusName
        this.webOrderTitle = webOrderTitle
        this.deliveryPlan = deliveryPlan
    }
}