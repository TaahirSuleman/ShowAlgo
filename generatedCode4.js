'use strict';
let arr = [1, 2, 3];
for (const item of arr) {
console.log(item);
}
arr.splice(2, 0, 4);
for (const item of arr) {
console.log(item);
}