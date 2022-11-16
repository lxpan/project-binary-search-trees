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

    minValueNode(node) {
        let current = node;
        
        while(current.left !== null) {
            current = current.left;
        }

        return current;
    }

    delete(value, root) {
        if (root == null) {
            return root;
        }

        // recurse through left subtree if value smaller than root
        if (value < root.data) {
            root.left = this.delete(value, root.left);
        }
        // recurse through right subtree if value greater than root
        else if (value > root.data) {
            root.right = this.delete(value, root.right);
        }

        else {
            // if leaf node, then simply remove it
            if (root.left == null && root.right == null) {
                return null;
            }
            // if node has one right child, return that child
            else if (root.left == null) {
                const tempNode = root.right;
                root = null;
                return tempNode;
            }
            // if node has one left child, return that child
            else if (root.right == null) {
                const tempNode = root.left;
                root = null;
                return tempNode;
            }
            /* == node with two children ==
            1. find the next biggest value -- i.e. find smallest value in right subtree relative to target node
            2. delete this node and copy key to target node */
            const temp = this.minValueNode(root.right);
            root.data = temp.data;
            root.right = this.delete(temp.data, root.right);
        }

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
        };

        _prettyPrint(this.root);
    }
}

const testArray = [1, 7, 4, 4, 23, 8, 9];
const testTree = new Tree(testArray);
console.log(testTree.prettyPrint());
console.log('--------------');
// testTree.root = testTree.insert(2, testTree.root);
testTree.root = testTree.delete(7, testTree.root);
console.log(testTree.prettyPrint());


