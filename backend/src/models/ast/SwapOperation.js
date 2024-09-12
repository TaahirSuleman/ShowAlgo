class SwapOperation {
    constructor(varName, firstPosition, secondPosition, line) {
        this.type = "SwapOperation";
        this.varName = varName;
        this.firstPosition = firstPosition;
        this.secondPosition = secondPosition;
        this.line = line;
    }
}

export default SwapOperation;
