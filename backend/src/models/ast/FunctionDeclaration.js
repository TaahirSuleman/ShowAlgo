class FunctionDeclaration {
    constructor(name, params, body, line) {
        this.type = "FunctionDeclaration";
        this.name = name;
        this.params = params;
        this.body = body;
        this.line = line;
    }
}

export default FunctionDeclaration;
