class MemoryError extends Error {
	constructor(message) {
		super(message);
		this.name = '[EJ::MemoryError]';
	}
}

module.exports = { MemoryError };