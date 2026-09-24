export default class Game {
    constructor(id, title, category, accessLevel, image) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.accessLevel = accessLevel;
        this.image = image;
    }

    isFree() {
        return this.accessLevel === "free";
    }

    isPremium() {
        return this.accessLevel === "premium";
    }
}