class Expression {
  constructor(left, operator, right) {
    this.type = "Expression";
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export default Expression;
