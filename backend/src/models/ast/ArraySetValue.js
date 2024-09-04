class ArraySetValue {
    constructor(varName, position, newValue, line) {
        this.type = "ArraySetValue";
        this.varName = varName;
        this.position = position;
        this.newValue = newValue;
        this.line = line;
    }
}

export default ArraySetValue;
