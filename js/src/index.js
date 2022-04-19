import process from 'process';
import { Interpreter } from './Interpreter';

class Comander {
  constructor(...params) {
    let file = undefined;

    if (/.+?\.sl/.test(params[0])) {
      file = params[0]
    }

    const interpreter = new Interpreter(file);
    
    interpreter.run();
  }
}

const comander = new Comander(...process.argv.slice(2));