const Node = function(data) {
	this.data = data;
	this.next = null;
}

const Queue = function() {
	this.head = null;
	this.tail = null;
	this.size = 0;
}

Queue.prototype.getSize = function() {return this.size;}
Queue.prototype.getHead = function() {return this.head;}
Queue.prototype.getTail = function() {return this.tail;}

Queue.prototype.isEmpty = function() {
	if (this.size) return false;
	return true;
}

Queue.prototype.clear = function() {
	if (this.isEmpty()) {
		return false;
	}
	
	this.head = null;
	this.tail = null;
	this.size = 0;
	return true;
}

Queue.prototype.check = function(operator) {
	if (this.isEmpty()) return false;
	if (!(operator && typeof(operator) == "function")) {
		return false;
	}

	let count = 0;
	let node;
	
	while (count <= this.size) {
		if (!node) node = this.head;
		else node = node.next;

		if (!node) {
			return false;
		}

		let data = node.data;
		if (!data) continue;

		if (operator(data, count)) {
			return true;
		}

		count++;
	}

	return false;
}

Queue.prototype.look = function(index = 0) {
	if (this.isEmpty()) return false;
	if (index < 0 || index > (this.size - 1)) return false;

	let count = 0;
	let node;
	
	while (count <= index) {
		if (!node) node = this.head;
		else node = node.next;

		if (!node) {
			return false;
		}

		count++;
	}

	return node;
}

Queue.prototype.push = function(data) {
	if (!data) return false;

	const node = new Node(data);

	if (this.isEmpty()) {
		this.head = node;
		this.tail = node;
	} else {
		this.tail.next = node;
		this.tail = node;
	}

	this.size++;
	return true;
}

Queue.prototype.pull = function() {
	if (this.isEmpty()) return false;

	const node = this.head;
	this.head = this.head.next;

	this.size--;
	return node.data;
}

Queue.prototype.display = function() {
	if (this.isEmpty()) return false;
	const result = [];

	let node = null;
	for (let i = 0; i < this.size; i++) {
		if (!node) {
			node = this.head;
			result.push(node);
			continue;
		}
		node = node.next;
		result.push(node);
	}

	return result;
}

Queue.prototype.delete = function(index) {
	if (!(index != null && typeof(index) == "number" && index >= 0)) {
		return false;
	}
	if (index >= this.size) return false;
	if (this.isEmpty()) return false;

	if (index == 0) {
		this.head = this.head.next;
		this.size--;
		if (this.size == 1) this.tail = this.head;
		else if (this.isEmpty()) {
			this.head = null;
			this.tail = null;
		}
		return true;
	}

	let node;

	for (let i = 0; i < index; i++) {
		if (!node) node = this.head;
		else node = node.next;
	}

	let next = node.next;

	if (!next) node.next = null;
	else node.next = next.next;

	if ((index + 1) == this.size) {
		this.tail = node;
	}

	this.size--;
	return true;
}

Queue.prototype.filter = function(operator) {
	if (this.isEmpty()) return false;
	if (!(operator && typeof(operator) == "function")) {
		return false;
	}

	let count = 0;
	let node;
	
	while (count <= this.size) {
		if (!node) node = this.head;
		else node = node.next;

		if (!node) {
			return false;
		}

		let data = node.data;
		if (!data) continue;

		if (operator(data, count)) {
			this.delete(count);
			continue;
		}

		count++;
	}

	return false;
}

module.exports = Queue;
