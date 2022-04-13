const { MemoryError } = require('./ErrorHandlers');

class Memory {
	constructor(size) {
		if (size > Memory.MAX_SIZE || size < Memory.MIN_SIZE) {
			throw new MemoryError('Invalid memory size');
		}

		this#memory = Array.from({ length: size }, (v, k) => 0x0);
		this.size = size;
		this#currentPos = 0;
	}

	static MAX_SIZE = 0xFFFF;
	static MIN_SIZE = 0x1;
	static MAX_VALUE = 0xFFFF;

	size;

	#memory;
	#currentPos;

	add(value) {
		if (this#memory[this#currentPos] + value > Memory.MAX_VALUE) {
			throw new MemoryError('Memory overflow');
		}

		this#memory[this#currentPos] += value;
	}

	xor(value) {
		if (this#memory[this#currentPos] ^ value > Memory.MAX_VALUE) {
			throw new MemoryError('Memory overflow');
		}

		this#memory[this#currentPos] ^= value;
	}

	rshift() {
		this#memory = [0, ...this#memory.slice(this.size - 1)];
	}

	lshift() {
		this#memory = [...this#memory.slice(1), 0];
	}

	rshiftIndex() {
		this#currentPos = (this#currentPos + 1) % Memory.MAX_SIZE;
	}

	lshiftIndex() {
		this#currentPos -= 1;

		if (this#currentPos < Memory.MIN_SIZE) {
			this#currentPos = Memory.MAX_SIZE - 1;
		}
	}

	output() {
		console.log(this#memory);
	}
}

module.exports = { Memory };