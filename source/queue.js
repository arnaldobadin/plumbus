const Node = function(data) {
	this.data = data;
	this.next = null;
}

const Queue = function() {
	this._head = null;
	this._tail = null;
	this._size = 0;
}

Queue.prototype.size = function() {return this._size;}
Queue.prototype.head = function() {return this._head;}
Queue.prototype.tail = function() {return this._tail;}

Queue.prototype.empty = function() {
	return !(this._size);
}

Queue.prototype.clear = function() {
	if (this.empty()) return false;
	
	this._head = null;
	this._tail = null;
	this._size = 0;
	return true;
}

Queue.prototype.push = function(data) {
	if (!data) return false;

	const node = new Node(data);

	if (this.empty()) {
		this._head = node;
		this._tail = node;
	} else {
		this._tail.next = node;
		this._tail = node;
	}

	this._size++;
	return true;
}

Queue.prototype.pull = function() {
	if (this.empty()) return false;

	const node = this._head;
	this._head = this._head.next;

	this._size--;
	return node.data;
}

Queue.prototype.delete = function(index) {
	if (!(index != null && typeof(index) == "number" && index >= 0)) {
		return false;
	}
	if (this.empty() || index >= this._size) {
        return false;
    }

	if (index == 0) {
		this._head = this._head.next;
		this._size--;
		if (this._size == 1) this._tail = this._head;
		else if (this.empty()) {
			this._head = null;
			this._tail = null;
		}
		return true;
	}

	let node;

	for (let i = 0; i < index; i++) {
		if (!node) node = this._head;
		else node = node.next;
	}

	let next = node.next;

	if (!next) node.next = null;
	else node.next = next.next;

	if ((index + 1) == this._size) {
		this._tail = node;
	}

	this._size--;
	return true;
}

module.exports = Queue;