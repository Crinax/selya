import fs from 'fs';
import process from 'process';
import { Parser } from '../Parser';

export class Interpreter {
  constructor(filename=null) {
    
    this._file = filename;
    this._parser = new Parser();
  }

  run() {
    if (this._file) {
      const fileContent = fs
        .readFileSync(this._file)
        .toString();

      this._parser.parse(fileContent);
      this._parser._memory.execute();
    } else {
      console.clear();
      console.log('[Selya::Repl] Write "exit" to exit the repl');
      console.log('[Selya::Repl] Hope you and enjoy :D\n');
      process.stdout.write('=> ');
      process.stdin.on('data', data => {
        const stringData = data.slice(0, -1).toString();
        
        if (stringData.trim() === 'exit') {
          this._parser._memory.execute();
          process.exit(0);
        } else {
          this._parser.parse(stringData)

          process.stdout.write('=> ');
        }
      });
    }
  }

  _file;
}