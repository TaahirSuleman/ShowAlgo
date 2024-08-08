class ForLoop {
    constructor(iterator, collection, body, line) {
        this.type = "ForLoop";
        this.iterator = iterator;
        this.collection = collection;
        this.body = body;
        this.line = line;
    }
}

export default ForLoop;
