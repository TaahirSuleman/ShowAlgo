class VariableDeclaration {
    constructor(varName, varType, value, line) {
        this.type = "VariableDeclaration";
        this.varName = varName;
        this.varType = varType;
        this.value = value;
        this.line = line;
    }
}

export default VariableDeclaration;
