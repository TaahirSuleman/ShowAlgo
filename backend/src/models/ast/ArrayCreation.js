class ArrayCreation {
    constructor(varName, arrType, values, unInitialised, line) {
        this.type = "ArrayCreation";
        this.varName = varName;
        this.arrType = arrType;
        this.values = values;
        this.unInitialised = unInitialised;
        this.line = line;
    }
}

export default ArrayCreation;
