export class MemoryError extends Error {
	constructor(message, namespace = '') {
		super(message);
		this.name = `[Selya::Memory${namespace}]`;
	}

	log() {
		console.log(`${this.name}: ${this.message}`);
	}
}