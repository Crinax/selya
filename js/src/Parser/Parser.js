import { ParserError, MemoryError } from '../ErrorHandlers';

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
  _currentPosition = { line: 1, symbol: 0 };

  parse(code, memory) {
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
        }

        if (operand.length < 6 && isBeginingOfNumber) {
          this._currentPosition.symbol = this._currentPosition.symbol - operand.length;
          this._throwErrorOperatorTooSmall();
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
              if (!this._tryMemoryWrapper(memory, 'add', parseInt(operand, 16))) {
                return false;
              }
            }

            if (operator === this._operator.xor) {
              if (!this._tryMemoryWrapper(memory, 'xor', parseInt(operand, 16))) {
                return false;
              }
            }

            operator = '';
            isOperatorNeededOperand = false;
          } else {
            if (!this._tryMemoryWrapper(memory, 'write', parseInt(operand, 16))) {
              return false;
            }
          }

          operand = '';
        }
      }

      if (isBeginingOfOperator) {
        if (isOperatorNeededOperand) {
          this._throwOperatorNeededOperandError();
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
              if (!this._tryMemoryWrapper(memory, 'lshiftIndex')) {
                return false;
              }

              break;
            }

            case this._operator.rshiftIndex: {
              if (!this._tryMemoryWrapper(memory, 'rshiftIndex')) {
                return false;
              }

              break;
            }

            case this._operator.lshift: {
              if (!this._tryMemoryWrapper(memory, 'lshift')) {
                return false;
              }

              break;
            }

            case this._operator.rshift: {
              if (!this._tryMemoryWrapper(memory, 'rshift')) {
                return false;
              }

              break;
            }
          }

          operator = '';
        }
      }
    }
  }

  _tryMemoryWrapper(memory, method, ...args) {
    try {
      memory[method](...args);
    } catch (err) {
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
}