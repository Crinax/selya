import { ParserError, MemoryError } from '../ErrorHandlers';
import { Memory } from '../Memory';

export class Parser {
  _operator = {
    lshiftIndex: '<--',
    rshiftIndex: '-->',
    add: '[+]',
    xor: '[^]',
    lshift: '[<]',
    rshift: '[>]',
  };
  _testRegex = new RegExp('[^\-\>\<\[\]\+0-9a-fA-Fx\n ]');
  _numbers = '0123456789ABCDEFabcdef';
  _currentPosition = { line: 1, symbol: 1 };
  _memory;

  setupMemory(code) {
    try {
      const memorySize = parseInt(code.slice(0, 6));

      if (isNaN(memorySize)) {
        this._throwInvalidMemorySize();
      }

      this._memory = new Memory(memorySize);

      return true;
    } catch (err) {
      if (err instanceof MemoryError) {
        this._callSelyaError();
        console.log(`${err.name}: ${err.message}`);
      } else {
        this._throwInvalidMemorySize();
      }

      return false;
    }
  }

  parse(code) {
    this._currentPosition = { line: 1, symbol: 0 };
    
    let operand = '';
    let operator = '';
    let isOperatorNeededOperand = false;
    let isBeginingOfOperator = false;
    let isBeginingOfNumber = false;
    let isZeroAtBegin = false;

    for (let i = 0; i < code.length; i++) {
      this._currentPosition.symbol++;

      if (code[i] === '\n') {
        this._currentPosition.line++;
        this._currentPosition.symbol = 1;
      }

      if (this._testRegex.test(code[i])) {
        this._throwUnrecognizedError();

        return false;
      }

      if (code[i] === ' ' || code[i] === '\n' || code[i] === '\t') {
        if (operator.length < 3 && isBeginingOfOperator) {
          this._currentPosition.symbol = this._currentPosition.symbol - operator.length;
          this._throwUnknownOperatorError();

          return false;
        }

        if (operand.length < 6 && isBeginingOfNumber) {
          this._currentPosition.symbol = this._currentPosition.symbol - operand.length;
          this._throwErrorOperatorTooSmall();

          return false;
        }

        continue;
      }

      if (code[i] === '0' && !isBeginingOfNumber) {
        if (isBeginingOfOperator) {
          this._throwUnrecognizedError();

          return false;
        }

        isBeginingOfNumber = true;
      }

      if ((code[i] === '-' || code[i] === '[' || code[i] === '<') && !isBeginingOfOperator) {
        if (isBeginingOfNumber) {
          this._throwUnrecognizedError();

          return false;
        }

        isBeginingOfOperator = true;
      }

      if (isBeginingOfNumber) {
        if (isZeroAtBegin) {
          if (code[i] !== 'x') {
            this._throwUnrecognizedError();

            return false;
          }
        }
        
        if (!this._numbers.includes(code[i]) && code[i] !== 'x') {
          this._throwUnrecognizedError();

          return false;
        }

        operand += code[i];
        
        if (operand.length === 6) {
          isBeginingOfNumber = false;

          if (isOperatorNeededOperand) {
            if (operator === this._operator.add) {
              if (!this._tryMemoryWrapper('add', parseInt(operand, 16))) {
                return false;
              }
            }

            if (operator === this._operator.xor) {
              if (!this._tryMemoryWrapper('xor', parseInt(operand, 16))) {
                return false;
              }
            }

            operator = '';
            isOperatorNeededOperand = false;
          } else {
            if (this._memory === undefined) {
              if (!this.setupMemory(operand)) {
                return false;
              }
            } else {
              console.log({
                operand,
                operator,
              });
              if (!this._tryMemoryWrapper('write', parseInt(operand, 16))) {
                return false;
              }
            }
          }

          operand = '';
        }
      }

      if (isBeginingOfOperator) {
        if (this._memory === undefined) {
          this._throwInvalidMemorySize();

          return false;
        }

        if (isOperatorNeededOperand) {
          this._throwOperatorNeededOperandError();

          return false;
        }

        operator += code[i];

        if (operator.length === 3) {
          isBeginingOfOperator = false;
          let possibleOperators = Object.values(this._operator);

          if (!possibleOperators.includes(operator)) {
            this._throwUnknownOperatorError();

            return false;
          }
          
          if (operator === this._operator.add || operator === this._operator.xor) {
            isOperatorNeededOperand = true;
            
            continue;
          }

          switch (operator) {
            case this._operator.lshiftIndex: {
              if (!this._tryMemoryWrapper('lshiftIndex')) {
                return false;
              }

              break;
            }

            case this._operator.rshiftIndex: {
              if (!this._tryMemoryWrapper('rshiftIndex')) {
                return false;
              }

              break;
            }

            case this._operator.lshift: {
              if (!this._tryMemoryWrapper('lshift')) {
                return false;
              }

              break;
            }

            case this._operator.rshift: {
              if (!this._tryMemoryWrapper('rshift')) {
                return false;
              }

              break;
            }
          }

          operator = '';
        }
      }
    }

    return true;
  }

  _tryMemoryWrapper(method, ...args) {
    try {
      this._memory[method](...args);
    } catch (err) {
      console.log(err);
      if (err instanceof MemoryError) {
        this._callSelyaError();
        console.log(`${err.name}: ${err.message}`);
      }

      return false;
    }

    return true;
  }

  _callSelyaError() {
    console.log(`[Selya:${this._currentPosition.line}:${this._currentPosition.symbol}]`);
  }

  _throwUnrecognizedError() {
    this._callSelyaError();
    new ParserError('Unrecognized symbol', '::UnrecognizedSymbol').log();
  }

  _throwErrorOperatorTooSmall() {
    this._callSelyaError();
    new ParserError('Operator is too small', '::SmallOperator').log();
  }

  _throwUnknownOperatorError() {
    this._callSelyaError();
    new ParserError('Unknown operator', '::UnknownOperator').log();
  }

  _throwOperatorNeededOperandError() {
    this._callSelyaError();
    new ParserError('Operand expected', '::UnexpectedOperator').log();
  }

  _throwInvalidMemorySize() {
    this._callSelyaError();
    new ParserError('Invalid memory size', '::MemorySize').log();
  }
}