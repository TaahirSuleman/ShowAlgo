class RemoveOperation {
    constructor(varName, positionToRemove, line) {
        this.type = "RemoveOperation";
        this.varName = varName;
        this.positionToRemove = positionToRemove;
        this.line = line;
    }
}

export default RemoveOperation;
