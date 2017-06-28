/*
 * 栈：一种遵从先进后出 (LIFO) 原则的有序集合；新添加的或待删除的元素都保存在栈的末尾，称作栈顶，另一端为栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。
 * 队列：与上相反，一种遵循先进先出 (FIFO / First In First Out) 原则的一组有序的项；队列在尾部添加新元素，并从头部移除元素。最新添加的元素必须排在队列的末尾。
 * 链表：存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的；每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（指针/链接）组成。
 * 集合：由一组无序且唯一（即不能重复）的项组成；这个数据结构使用了与有限集合相同的数学概念，但应用在计算机科学的数据结构中。
 * 字典：以 [键，值] 对为数据形态的数据结构，其中键名用来查询特定元素，类似于 Javascript 中的Object。
 * 散列：根据关键码值（Key value）直接进行访问的数据结构；它通过把关键码值映射到表中一个位置来访问记录，以加快查找的速度；这个映射函数叫做散列函数，存放记录的数组叫做散列表。
 * 树：由 n（n>=1）个有限节点组成一个具有层次关系的集合；把它叫做“树”是因为它看起来像一棵倒挂的树，也就是说它是根朝上，而叶朝下的，基本呈一对多关系，树也可以看做是图的特殊形式。
 * 图：图是网络结构的抽象模型；图是一组由边连接的节点（顶点）；任何二元关系都可以用图来表示，常见的比如：道路图、关系图，呈多对多关系。
 * */
class Stack {
    constructor() {
        this.stacks = [];
    }

    //入栈
    push(item) {
        this.stacks.push(item);
    }

    //出栈
    pop() {
        return this.stacks.pop();
    }

    // 末位
    get peek() {
        return this.stacks[this.stacks.length - 1]
    }

    // 是否为空栈
    get isEmpty() {
        return !this.stacks.length
    }

    // 尺寸
    get size() {
        return this.stacks.length
    }

    // 清空栈
    clear() {
        this.stacks = []
    }

    // 打印栈数据
    print() {
        console.log(this.stacks.toString())
    }

}
class Queue {
    constructor(items) {
        this.items = items || []
    }

    enqueue(element) {
        this.items.push(element)
    }

    dequeue() {
        return this.items.shift()
    }

    front() {
        return this.items[0]
    }

    clear() {
        this.items = []
    }

    get size() {
        return this.items.length
    }

    get isEmpty() {
        return !this.items.length
    }

    print() {
        console.log(this.items.toString())
    }
}
/*优先队列*/
class PriorityQueue {
    constructor(items) {
        this.items = items || []
    }

    enqueue(element, priority) {
        let _queue = {element, priority};
        if (this.isEmpty) {
            this.items.push(_queue);
        } else {
            let _index = this.items.findIndex((item) => _queue.priority < item.priority);
            if (_index > -1) {
                this.items.splice(_index, 0, _queue);
            } else {
                this.items.push(_queue)
            }
        }
    }

    dequeue() {
        return this.items.shift()
    }

    front() {
        return this.items[0]
    }

    clear() {
        this.items = []
    }

    get size() {
        return this.items.length
    }

    get isEmpty() {
        return !this.items.length
    }

    print() {
        console.log(this.items.toString())
    }
}
/*循环队列*/
class LoopQueue extends Queue {
    constructor(items) {
        super(items)
    }

    getIndex(index) {
        let _length = this.size;
        return index < _length ? index : (index % _length)
    }

    find(index) {
        return !this.isEmpty ? this.items[this.getIndex(index)] : null;
    }
}

class Node {
    constructor(element) {
        this.element = element;
        this.next = null;
    }
}
class LinkedList {
    constructor() {
        this.head = null;
        this.length = 0;
    }

    append(element) {
        let node = new Node(element);
        if (this.head === null) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.length++;
    }

    insertAt(element, position) {
        if (position >= 0 && position <= this.length) {
            const node = new Node(element);
            let current = this.head;
            if (position === 0) {
                if (this.head) {
                    node.next = current;
                    this.head = node;
                } else {
                    this.head = node;
                }
            } else {
                let previous = null;
                let index = 0;
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true
        }
        return false;
    }

    removeAt(position) {
        if (position >= 0 && position < this.length) {
            let current = this.head;
            if (position === 0) {
                this.head = current.next;
            } else {
                let previous = null;
                let index = 0;
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.length--;
            return current.element;
        }
        return null;
    }

    removeElement(element) {
        let index = this.findElement(element);
        return this.removeAt(index);
    }

    findElement(element) {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.element === element) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    }
}

/*双向链表*/
class DoublyNode {
    constructor(element) {
        this.element = element;
        this.prev = null;
        this.next = null;
    }
}
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(element) {
        let node = new DoublyNode(element);
        if (this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
            node.prev = current;
            this.tail = node;
        }
        this.length++;
    }

    insertAt(element, position) {
        if (position >= 0 && position <= this.length) {
            let node = new DoublyNode(element);
            let current = this.head;
            if (position === 0) {
                if (this.head) {
                    node.next = current;
                    this.head = node;
                    current.prev = node;
                } else {
                    this.head = node;
                    this.tail = node;
                }
            } else if (position === this.length) {
                current = this.tail;
                current.next = node;
                node.prev = current;
                this.tail = node;
            } else {
                let index = 0;
                let previous = null;
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = node;
                node.next = current;
                node.prev = previous;
                current.prev = node;
            }
            this.length++;
            return true;
        }
        return false
    }

    removeAt(position) {
        if (this.isEmpty) {
            return null;
        }
        if (position >= 0 && position < this.length) {
            let current = this.head;
            if (this.length === 1) {
                this.head = null;
                this.tail = null;
            } else if (this.length === 2) {
                if (position === 0) {
                    this.head = this.head.next;
                    this.head.prev = null;
                    this.tail.prev = null;
                } else {
                    current = this.tail;
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                    this.head.next = null;
                }
            } else {
                if (position === 0) {
                    this.head = this.head.next;
                    this.head.prev = null;
                } else if (position === this.length - 1) {
                    current = this.tail;
                    this.tail = this.tail.prev;
                    this.tail.next = null
                } else {
                    let index = 0;
                    let previous = null;
                    while (index++ < position) {
                        previous = current;
                        current = current.next;
                    }
                    previous.next = current.next;
                    current.next.prev = previous;
                }
            }
            this.length--;
            return current.element;
        }
        return null;
    }

    get isEmpty() {
        return !this.length;
    }
}


class HashTable {
    constructor() {
        this.table = [];
        this.hashCode = {}
    }

    // 散列函数
    loseHashCode(key) {
        let hash = Symbol(key);
        this.hashCode[key] = hash;
        return hash;
    }

    // 修改和增加元素
    put(key, value) {
        const position = this.loseHashCode(key);
        this.table[position] = value;
    }

    get(key) {
        return this.table[this.hashCode[key]]
    }

    remove(key) {
        this.table[this.hashCode[key]] = undefined
    }
}


class TreeNode {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null
    }

    insert(key) {
        const Node = new TreeNode(key);
        const insertNode = function (node, newNode) {
            if (newNode.key < node.key) {
                if (node.left === null) {
                    node.left = newNode
                } else {
                    insertNode(node.left, newNode);
                }
            } else {
                if (node.right === null) {
                    node.right = newNode
                } else {
                    insertNode(node.right, newNode);
                }
            }
        };
        if (!this.root) {
            this.root = Node;
        } else {
            insertNode(this.root, Node)
        }
    }

    inOrderTraverse(callback) {
        const inOrderTraverseNode = (node, callback) => {
            if (node !== null) {
                inOrderTraverseNode(node.left, callback);
                callback(node.key);
                inOrderTraverseNode(node.right, callback)
            }
        };
        inOrderTraverseNode(this.root, callback)
    }
}



