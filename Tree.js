import Node from './Node.js';

class Tree {
    constructor(values) {
        this.root = null;
        this.values = values;
    }

    buildTree() {
        // 1. Sort values
        const sorted = this.values.sort((a, b) => a - b);
        // 2. Remove duplicates by "casting" it as a Set
        this.values = Array.from(new Set(sorted));
        console.log(this.values);

        
    }
}

const testArray = [1, 7, 4, 4, 23, 8, 9];
const testTree = new Tree(testArray);
testTree.buildTree();
