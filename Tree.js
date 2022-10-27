import Node from './Node.js';

class Tree {
    constructor(values) {
        this.array = ((v) => {
            // 1. Sort values
            const sorted = v.sort((a, b) => a - b);
            // 2. Remove duplicates by "casting" array as a Set
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

        // calculate middle value in sorted array
        const mid = Math.trunc((start + end) / 2);
        // construct root node using mid value
        const root = Node(arr[mid]);

        // recurse through left and right subtrees
        root.left = this.buildTree(arr, start, mid - 1);
        root.right = this.buildTree(arr, mid + 1, end);

        return root;
    }

    search(value, root) {
        if (root == null || root.data == value) {
            return root;
        }

        if (value < root.data) {
            return this.insert(value, root.left);
        } else {
            return this.insert(value, root.right)
        }
    }

    insert(value, root) {
        if (root == null || root == undefined) {
            return Node(value);
        }

        if (value < root.data) {
            // return this.insert(value, root.left);
            root.left = this.insert(value, root.left);
        }
        else if (value > root.data) {
            // return this.insert(value, root.right);
            root.right = this.insert(value, root.right);
        }

        // return root node after insertion
        return root;
    }

    delete(value, root) {
        
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
        };

        _prettyPrint(this.root);
    }
}

const testArray = [1, 7, 4, 4, 23, 8, 9];
const testTree = new Tree(testArray);
console.log(testTree.prettyPrint());
console.log('--------------');
// testTree.root = testTree.insert(2, testTree.root);
testTree.root = testTree.delete(1, testTree.root);
console.log(testTree.prettyPrint());
