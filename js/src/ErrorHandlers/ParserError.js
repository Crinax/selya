export class ParserError extends Error {
	constructor(message, namespace = '') {
		super(message);
		this.name = `[Selya::Parser${namespace}]`;
	}

	log() {
		console.log(`${this.name}: ${this.message}`);
	}
}