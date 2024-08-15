class LoopFromTo {
    constructor(start, end, body, line) {
        this.type = "LoopFromTo";
        this.range = { start, end };
        this.body = body;
        this.line = line;
    }
}

export default LoopFromTo;
