import { MemoryError } from '../ErrorHandlers';

export class Memory {
	constructor(size) {
		if (size > Memory.MAX_SIZE || size < Memory.MIN_SIZE) {
			throw new MemoryError('Invalid memory size');
		}

		this._memory = Array.from({ length: size }, () => 0x0);
		this.size = size;
		this._currentPos = 0;
	}

	static MAX_SIZE = 0xFFFF;
	static MIN_SIZE = 0x1;
	static MAX_VALUE = 0xFFFF;

	size;

	_memory;
	_currentPos;

	write(value) {
		this._checkIfCorrect(value);

		this._memory[this._currentPos] = value;
	}

	add(value) {
		this._checkIfCorrect(value);

		if ((this._memory[this._currentPos] + value) > Memory.MAX_VALUE) {
			throw new MemoryError('Cell is overflowed', '::Overflow');
		}

		this._memory[this._currentPos] += value;
	}

	xor(value) {
		this._checkIfCorrect(value);

		if ((this._memory[this._currentPos] ^ value) > Memory.MAX_VALUE) {
			throw new MemoryError('Cell is overflowed', '::Overflow');
		}

		this._memory[this._currentPos] ^= value;
	}

	rshift() {
		this._memory = [0, ...this._memory.slice(0, this.size - 1)];
	}

	lshift() {
		this._memory = [...this._memory.slice(1), 0];
	}

	rshiftIndex() {
		if (this._currentPos + 1 > this.size) {
			throw new MemoryError('Carriage out of boundaries of memory', '::OutOfRange');
		}

		this._currentPos += 1;
	}

	lshiftIndex() {
		if (this._currentPos - 1 < Memory.MIN_SIZE) {
			throw new MemoryError('Carriage out of boundaries of memory', '::OutOfRange');
		}

		this._currentPos -= 1;
	}

	output() {
		console.log(this._memory);
	}

	_checkIfCorrect(value) {
		if (value > 0xFFFF || value < 0x0) {
			throw new MemoryError('Invalid value', '::InvalidValue')
		}
	}
}