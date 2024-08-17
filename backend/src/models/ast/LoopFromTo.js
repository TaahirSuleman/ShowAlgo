class LoopFromTo {
    constructor(loopVariable, start, end, body, line) {
        this.type = "LoopFromTo";
        this.loopVariable = loopVariable;
        this.range = { start, end };
        this.body = body;
        this.line = line;
    }
}

export default LoopFromTo;
