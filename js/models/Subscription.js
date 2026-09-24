export default class Subscription {
    constructor(type, price) {
        this.type = type;
        this.price = price;
    }

    isPremium() {
        return this.type === "premium";
    }

    isFree() {
        return this.type === "free";
    }
}