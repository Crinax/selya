"use strict";var _ErrorHandlers=require("../ErrorHandlers");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Parser=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),Object.defineProperty(a,"prototype",{writable:!1}),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Parser=/*#__PURE__*/function(){function a(){_classCallCheck(this,a),_defineProperty(this,"_operator",{lshiftIndex:"<--",rshiftIndex:"-->",add:"[+]",xor:"[^]",lshift:"[<]",rshift:"[>]"}),_defineProperty(this,"_testRegex",/[^-><[]+0-9a-fA-Fx\n ]/),_defineProperty(this,"_numbers","0123456789ABCDEFabcdef"),_defineProperty(this,"_currentPosition",{line:1,symbol:0})}return _createClass(a,[{key:"newParse",value:function newParse(a,b){this._currentPosition={line:1,symbol:0};for(var c="",d="",e=!1,f=!1,g=!1,h=0;h<a.length;h++){// console.log({
//   operand,
//   operator,
//   memory,
//   isOperatorNeededOperand,
//   isBeginingOfOperator,
//   isBeginingOfNumber,
//   isZeroAtBegin,
//   line: this._currentPosition.line,
//   sym: this._currentPosition.symbol,
// });
if(this._currentPosition.symbol++,"\n"===a[h]&&(this._currentPosition.line++,this._currentPosition.symbol=1),this._testRegex.test(a[h]))return this._throwUnrecognizedError(),!1;if(" "===a[h]||"\n"===a[h]||"\t"===a[h]){3>d.length&&f&&(this._currentPosition.symbol-=d.length,this._throwUnknownOperatorError()),6>c.length&&g&&(this._currentPosition.symbol-=c.length,this._throwErrorOperatorTooSmall());continue}if("0"===a[h]&&!g){if(f)return this._throwUnrecognizedError(),!1;g=!0}if("-"!==a[h]&&"["!==a[h]&&"<"!==a[h]||f||(g&&this._throwUnrecognizedError(),f=!0),g){if(!1&&"x"!==a[h])return this._throwUnrecognizedError(),!1;if(!this._numbers.includes(a[h])&&"x"!==a[h])return this._throwUnrecognizedError(),!1;if(c+=a[h],6===c.length){if(g=!1,e){if(d===this._operator.add&&!this._tryMemoryWrapper(b,"add",parseInt(c,16)))return!1;if(d===this._operator.xor&&!this._tryMemoryWrapper(b,"xor",parseInt(c,16)))return!1;d="",e=!1}else if(!this._tryMemoryWrapper(b,"write",parseInt(c,16)))return!1;c=""}}if(f&&(e&&this._throwOperatorNeededOperandError(),d+=a[h],3===d.length)){f=!1;var j=Object.values(this._operator);if(!j.includes(d))return this._throwUnknownOperatorError(),!1;if(d===this._operator.add||d===this._operator.xor){e=!0;continue}switch(d){case this._operator.lshiftIndex:{if(!this._tryMemoryWrapper(b,"lshiftIndex"))return!1;break}case this._operator.rshiftIndex:{if(!this._tryMemoryWrapper(b,"rshiftIndex"))return!1;break}case this._operator.lshift:{if(!this._tryMemoryWrapper(b,"lshift"))return!1;break}case this._operator.rshift:{if(!this._tryMemoryWrapper(b,"rshift"))return!1;break}}d=""}}}},{key:"_tryMemoryWrapper",value:function _tryMemoryWrapper(a,b){try{for(var c=arguments.length,d=Array(2<c?c-2:0),e=2;e<c;e++)d[e-2]=arguments[e];a[b].apply(a,d)}catch(a){return a instanceof _ErrorHandlers.MemoryError&&(this._callSelyaError(),console.log("".concat(a.name,": ").concat(a.message))),!1}return!0}},{key:"_callSelyaError",value:function _callSelyaError(){console.log("[Selya:".concat(this._currentPosition.line,":").concat(this._currentPosition.symbol,"]"))}},{key:"_throwUnrecognizedError",value:function _throwUnrecognizedError(){this._callSelyaError(),new _ErrorHandlers.ParserError("Unrecognized symbol","::UnrecognizedSymbol").log()}},{key:"_throwErrorOperatorTooSmall",value:function _throwErrorOperatorTooSmall(){this._callSelyaError(),new _ErrorHandlers.ParserError("Operator is too small","::SmallOperator").log()}},{key:"_throwUnknownOperatorError",value:function _throwUnknownOperatorError(){this._callSelyaError(),new _ErrorHandlers.ParserError("Unknown operator","::UnknownOperator").log()}},{key:"_throwOperatorNeededOperandError",value:function _throwOperatorNeededOperandError(){this._callSelyaError(),new _ErrorHandlers.ParserError("Operand expected","::UnexpectedOperator").log()}}]),a}();exports.Parser=Parser;