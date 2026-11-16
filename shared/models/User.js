export default class User {
    constructor(id, name, email, subscription) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.subscription = subscription;
    }

    isPremium() {
        return this.subscription.isPremium();
    }

    canPlay(game) {
        return game.isFree() || this.isPremium();
    }
}