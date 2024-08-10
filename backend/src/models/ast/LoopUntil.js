class LoopUntil {
    constructor(condition, body, line) {
        this.type = "LoopUntil";
        this.condition = condition;
        this.body = body;
        this.line = line;
    }
}

export default LoopUntil;
