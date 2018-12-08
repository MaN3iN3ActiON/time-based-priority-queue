class PriorityQueue {
	constructor(data) {
		this._heap = [];
	}
	size() {
		return this._heap.length;
	}
	isEmpty() {
		return this._heap.length === 0;
	}
	_getParent(i) {
		return Math.ceil(i / 2) - 1;
	}
	_getLeftChild(i) {
		return 2 * i + 1;
	}
	_getRightChild(i) {
		return 2 * i + 2;
	}
	_swap(i, j) {
		[this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
	}
	peek() {
		return this._heap[0];
	}
	push(record) {
		const tte = Date.parse(record.tte);
		this._heap.push(record);
		this.swim();
		return this.size();
	}
	pop() {
		const ret = this.peek();
		const last = this.size() - 1;
		if (last > 0) {
			this._swap(0, last);
		}
		//array pop
		this._heap.pop();
		this.sink();
		return ret;
	}
	_expiresFirst(i, j) {
		const ti = Date.parse(this._heap[i].tte);
		const tj = Date.parse(this._heap[j].tte);
		if (ti === tj && (this._heap[i].priority > this._heap[j].priority)) {
			return true;
		}
		return ti < tj;
	}
	swim() {
		let task = this.size() - 1;
		while (task > 0 && this._expiresFirst(task, this._getParent(task))) {
			this._swap(task, this._getParent(task));
			task = this._getParent(task);
		}
	}
	sink() {
		let task = 0;
		while (
			(this._getLeftChild(task) < this.size() &&
				this._expiresFirst(this._getLeftChild(task), task)) ||
			(this._getRightChild(task) < this.size() &&
				this._expiresFirst(this._getRightChild(task), task))
		) {
			const expiresFirst =
				this._getRightChild(task) < this.size() &&
				this._expiresFirst(this._getRightChild(task), this._getLeftChild(task))
					? this._getRightChild(task)
					: this._getLeftChild(task);
			this._swap(task, expiresFirst);
			task = expiresFirst;
		}
	}
}
module.exports = PriorityQueue;
