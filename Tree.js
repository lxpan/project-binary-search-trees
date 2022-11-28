import Node from './Node.js';

class Tree {
    constructor(values) {
        this.array = this.constructor.sortArray(values);
        // console.log(this.array);
        this.root = this.buildTree(this.array, 0, this.array.length - 1);
    }

    static sortArray(values) {
        const sorted = ((v) => {
            // 1. Sort values
            const sortedValues = v.sort((a, b) => a - b);
            // 2. Remove duplicates by "casting" array as a Set
            return Array.from(new Set(sortedValues));
        })(values);
        return sorted;
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
        if (root == null || root.data === value) {
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
        if (root === null || root === undefined) {
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

    static minValueNode(node) {
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
            if (root.left == null) {
                return root.right;
            }
            // if node has one left child, return that child
            if (root.right == null) {
                return root.left;
            }
            /* == node with two children ==
            1. find the next biggest value
            -- i.e. find smallest value in right subtree relative to target node
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
                    false,
                );
            }
            console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
            if (node.left !== null) {
                _prettyPrint(
                    node.left,
                    `${prefix}${isLeft ? '    ' : '│   '}`,
                    true,
                );
            }
        };

        _prettyPrint(this.root);
    }

    // Queue: <-- [A, B, C, D] ---
    levelOrder(root = this.root, func) {
        const queue = [];
        const nodesVisited = [];

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
    inOrder(startNode = this.root, func) {
        const visited = [];

        const traverse = (root) => {
            if (root == null) {
                return;
            }

            traverse(root.left);

            if (typeof func === 'function') {
                func(root.data);
            }
            else {
                visited.push(root.data);
            }

            traverse(root.right);
        };

        traverse(startNode);

        // if (typeof func !== 'function') {
        //     // console.log(visited);
        //     return visited;
        // }
        return visited;
    }

    // Visit root, left, right
    preOrder(startNode = this.root, func, logging = false) {
        const visited = [];

        const traverse = (root) => {
            if (root == null) {
                return;
            }

            if (typeof func === 'function') {
                const result = func(root);
                const value = root.data;

                if (logging) {
                    console.log(`Node value: ${value}, isBalanced: ${result}`);
                }
            }
            visited.push(root);
            traverse(root.left);
            traverse(root.right);
        };

        traverse(startNode);

        const visitedValues = visited.map((node) => node.data);

        if (typeof func === 'function') {
            const results = visited.map(func);

            return {
                visited,
                visitedValues,
                results,
            };
        }

        return visitedValues;
    }

    postOrder(startNode = this.root, func) {
        const visited = [];

        const traverse = (root) => {
            if (root == null) {
                return;
            }

            traverse(root.left);
            traverse(root.right);

            if (typeof func === 'function') {
                func(root.data);
            }
            else {
                visited.push(root.data);
            }
        };

        traverse(startNode);

        // if (typeof func !== 'function') {
        //     // console.log(visited);
        //     return visited;
        // }
        return visited;
    }

    // height of node = #edges in longest path from node to leaf node
    height(node) {
        // base case: at children-less leaf node
        if (node == null) {
            return -1;
        }

        // find height of left subtree
        const leftHeight = this.height(node.left);
        // find height of right subtree
        const rightHeight = this.height(node.right);
        // height = greater of two subtrees
        return Math.max(leftHeight, rightHeight) + 1;
    }

    // value = node.data
    depth(node) {
        const rootDepth = 0;

        function getDepth(root, target, _depth) {
            // value found
            if (root == null || root.data === target.data) {
                return _depth;
            }

            // value less than root value
            if (target.data < root.data) {
                return getDepth(root.left, target, _depth + 1);
            }
            // value greater than root value
            return getDepth(root.right, target, _depth + 1);
        }

        return getDepth(this.root, node, rootDepth);
    }

    // checks if tree is balanced
    isBalanced() {
        // const nodeHeights = [];

        // using preOrder node traversal, check that each node is balanced
        const nodeHeights = this.preOrder(
            this.root,
            (_node) => {
                // at each node, get left & right subtree's height
                // NB: we are calling our previously implemented height() method
                const leftHeight = this.height(_node.left);
                const rightHeight = this.height(_node.right);
                // calculate the absolute difference
                const heightDiff = Math.abs(leftHeight - rightHeight);
                // console.log(`LR diff: ${heightDiff}`);

                // nodeHeights.push(heightDiff);
                // node is balanced if difference of left and right subtrees less than 1
                return heightDiff <= 1;
            },
            false,
        );

        // console.log(nodeHeights);

        // if any node is false, then the overall tree is unbalanced
        return !nodeHeights.results.some((bool) => bool === false);
    }

    rebalance() {
        const nodeValues = this.preOrder(this.root);
        // return nodes;

        const sorted = this.constructor.sortArray(nodeValues);
        this.root = this.buildTree(sorted, 0, sorted.length - 1);
    }
}

function randomArray(length, max) {
    const array = [];

    for (let i = 0; i <= length; i++) {
        const int = Math.floor(Math.random() * max);
        array.push(int);
    }

    return array;
}

// 1. Create BST from array of random integers
const randValues = randomArray(8, 20);
const tree = new Tree(randValues);
tree.prettyPrint();

// 2. Confirm Tree is balanced
console.log(`Tree is balanced: ${tree.isBalanced()}`);

// 3. Print out the tree using various traversal methods
console.log(`Level order: ${tree.levelOrder(tree.root)}`);
console.log(`Pre order: ${tree.preOrder()}`);
console.log(`Post order: ${tree.postOrder()}`);
console.log(`In order: ${tree.inOrder()}`);

// 4. Unbalance the tree by adding several very large numbers
tree.insert(101, tree.root);
tree.insert(107, tree.root);
tree.insert(113, tree.root);
tree.insert(131, tree.root);

tree.prettyPrint();
// 5. Confirm that tree is unbalanced
console.log(`Tree is balanced: ${tree.isBalanced()}`);

// 6. Rebalance tree
tree.rebalance();
console.log('*** After rebalancing... ***');
tree.prettyPrint();
console.log(`Is tree balanced: ${tree.isBalanced()}`);

// 7. Print out the tree using various traversal methods
console.log(`Level order: ${tree.levelOrder(tree.root)}`);
console.log(`Pre order: ${tree.preOrder()}`);
console.log(`Post order: ${tree.postOrder()}`);
console.log(`In order: ${tree.inOrder()}`);
