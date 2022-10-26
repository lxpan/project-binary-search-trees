import Node from './Node.js';

class Tree {
    constructor(values) {
        this.array = ((v) => {
            // 1. Sort values
            const sorted = v.sort((a, b) => a - b);
            // 2. Remove duplicates by "casting" it as a Set
            return Array.from(new Set(sorted));
        })(values);
        console.log(this.array);
        this.root = this.buildTree(this.array, 0, this.array.length - 1);
    }

    buildTree(arr, start, end) {
        // base case
        if (start > end) {
            return null;
        }

        const mid = Math.trunc((start + end) / 2);
        const root = Node(arr[mid]);

        root.left = this.buildTree(arr, start, mid - 1);
        root.right = this.buildTree(arr, mid + 1, end);

        return root;
    }
    prettyPrint() {
        const _prettyPrint = (node, prefix = '', isLeft = true) => {
            if (node.right !== null) {
                _prettyPrint(
                    node.right,
                    `${prefix}${isLeft ? '│   ' : '    '}`,
                    false
                );
            }
            console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
            if (node.left !== null) {
                _prettyPrint(
                    node.left,
                    `${prefix}${isLeft ? '    ' : '│   '}`,
                    true
                );
            }
        }

        _prettyPrint(this.root);
    }
    
}

// const testArray = [1, 7, 4, 4, 23, 8, 9];
const testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testTree = new Tree(testArray);
console.log(testTree.prettyPrint());
