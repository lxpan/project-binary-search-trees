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

    find(value, root) {
        // value found
        if (root == null || root.data == value) {
            return root;
        }

        // value less than root value
        if (value < root.data) {
            return this.find(value, root.left);
        }
        // value greater than root value
        return this.find(value, root.right);
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

        while (current.left !== null) {
            current = current.left;
        }

        return current;
    }

    delete(data, root) {
        if (root == null) {
            return root;
        }

        // recurse through left subtree if value smaller than root
        if (data < root.data) {
            root.left = this.delete(data, root.left);
        }
        // recurse through right subtree if value greater than root
        else if (data > root.data) {
            root.right = this.delete(data, root.right);
        }

        else {
            // if leaf node, then simply remove it
            if (root.left == null && root.right == null) {
                return null;
            }
            // if node has one right child, return that child
            else if (root.left == null) {
                return root.right;
            }
            // if node has one left child, return that child
            else if (root.right == null) {
                return root.left;
            }
            /* == node with two children ==
            1. find the next biggest value -- i.e. find smallest value in right subtree relative to target node
            2. copy NBV data to target node data */
            root.data = this.minValueNode(root.right).data;
            // 3. delete the in-order successor (that next biggest value)
            root.right = this.delete(root.data, root.right);
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

    // Queue: <-- [A, B, C, D] ---
    levelOrder(root, func) {
        let queue = [];
        let nodesVisited = [];

        queue.push(root);

        while (queue.length > 0) {
            // dequeue
            const node = queue.shift();
            nodesVisited.push(node.data);
            // enqueue
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        if (func == null) {
            return nodesVisited;
        }

        return nodesVisited.map(func);
    }

    // Go left, visit root, go right
    inOrder(startNode=this.root, func) {
        const visited = [];

        const traverse = (root) => {
            if (root == null) {
                return;
            }
    
            traverse(root.left);
    
            if(typeof func == 'function') {
                func(root.data);
            } else {
                visited.push(root.data);
            }
            
            traverse(root.right);
        }

        traverse(startNode);

        if (typeof func !== 'function') {
            console.log(visited);
            return visited;
        }        
    }

    // Visit root, left, right
    preOrder(startNode=this.root, func) {
        const visited = [];

        const traverse = (root) => {
            if (root == null) {
                return;
            }

            if(typeof func == 'function') {
                func(root.data);
            } else {
                visited.push(root.data);
            }

            traverse(root.left);
            traverse(root.right);
        }

        traverse(startNode);

        if (typeof func !== 'function') {
            console.log(visited);
            return visited;
        }        
    }

    postOrder(startNode=this.root, func) {
        const visited = [];

        const traverse = (root) => {
            if (root == null) {
                return;
            }

            traverse(root.left);
            traverse(root.right);

            if(typeof func == 'function') {
                func(root.data);
            } else {
                visited.push(root.data);
            }
        }

        traverse(startNode);

        if (typeof func !== 'function') {
            console.log(visited);
            return visited;
        }        
    }   
}

const testArray = [1, 7, 4, 4, 23, 8, 9];
const testTree = new Tree(testArray);
console.log('--------------');
testTree.root = testTree.insert(2, testTree.root);
console.log(testTree.prettyPrint());
// testTree.root = testTree.delete(7, testTree.root);
// console.log(testTree);
// console.log(testTree.prettyPrint());

// console.log(testTree.find(100, testTree.root));
// const traversal = testTree.levelOrder(testTree.root, (x) => x * 2);
// console.log(traversal);

// testTree.inOrder(testTree.root, (x) => console.log(x * 2));
testTree.inOrder();
testTree.preOrder();
testTree.postOrder();
