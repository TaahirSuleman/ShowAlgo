class IndexExpression {
    constructor(source, index, line) {
        this.type = "IndexExpression";
        this.source = source; // The string or array being indexed
        this.index = index; // The index being accessed
        this.line = line;
    }
}

export default IndexExpression;
