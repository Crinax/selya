import fs from 'fs';

class Interpreter {
  constructor(filename=null) {
    this._file = filename;
  }

  _file;
  _memory;
  _currentRowNumber = 1;
  _currentColumnNumber = 1;
  _info;
}