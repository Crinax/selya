"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Parser=void 0;var _ErrorHandlers=require("../ErrorHandlers"),_Memory=require("../Memory");function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),Object.defineProperty(a,"prototype",{writable:!1}),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Parser=/*#__PURE__*/function(){function a(){_classCallCheck(this,a),_defineProperty(this,"_operator",{lshiftIndex:"<--",rshiftIndex:"-->",add:"[+]",xor:"[^]",lshift:"[<]",rshift:"[>]"}),_defineProperty(this,"_testRegex",/[^-><[]+0-9a-fA-Fx\n ]/),_defineProperty(this,"_numbers","0123456789ABCDEFabcdef"),_defineProperty(this,"_currentPosition",{line:1,symbol:1}),_defineProperty(this,"_memory",void 0)}return _createClass(a,[{key:"setupMemory",value:function setupMemory(a){try{var b=parseInt(a.slice(0,6));return isNaN(b)&&this._throwInvalidMemorySize(),this._memory=new _Memory.Memory(b),!0}catch(a){return a instanceof _ErrorHandlers.MemoryError?(this._callSelyaError(),console.log("".concat(a.name,": ").concat(a.message))):this._throwInvalidMemorySize(),!1}}},{key:"parse",value:function parse(a){this._currentPosition={line:1,symbol:0};for(var b="",c="",d=!1,e=!1,f=!1,g=0;g<a.length;g++){if(this._currentPosition.symbol++,"\n"===a[g]&&(this._currentPosition.line++,this._currentPosition.symbol=1),this._testRegex.test(a[g]))return this._throwUnrecognizedError(),!1;if(" "===a[g]||"\n"===a[g]||"\t"===a[g]){if(3>c.length&&e)return this._currentPosition.symbol-=c.length,this._throwUnknownOperatorError(),!1;if(6>b.length&&f)return this._currentPosition.symbol-=b.length,this._throwErrorOperatorTooSmall(),!1;continue}if("0"===a[g]&&!f){if(e)return this._throwUnrecognizedError(),!1;f=!0}if(("-"===a[g]||"["===a[g]||"<"===a[g])&&!e){if(f)return this._throwUnrecognizedError(),!1;e=!0}if(f){if(!1&&"x"!==a[g])return this._throwUnrecognizedError(),!1;if(!this._numbers.includes(a[g])&&"x"!==a[g])return this._throwUnrecognizedError(),!1;if(b+=a[g],6===b.length){if(f=!1,d){if(c===this._operator.add&&!this._tryMemoryWrapper("add",parseInt(b,16)))return!1;if(c===this._operator.xor&&!this._tryMemoryWrapper("xor",parseInt(b,16)))return!1;c="",d=!1}else if(void 0===this._memory){if(!this.setupMemory(b))return!1;}else if(!this._tryMemoryWrapper("write",parseInt(b,16)))return!1;b=""}}if(e){if(void 0===this._memory)return this._throwInvalidMemorySize(),!1;if(d)return this._throwOperatorNeededOperandError(),!1;if(c+=a[g],3===c.length){e=!1;var h=Object.values(this._operator);if(!h.includes(c))return this._throwUnknownOperatorError(),!1;if(c===this._operator.add||c===this._operator.xor){d=!0;continue}switch(c){case this._operator.lshiftIndex:{if(!this._tryMemoryWrapper("lshiftIndex"))return!1;break}case this._operator.rshiftIndex:{if(!this._tryMemoryWrapper("rshiftIndex"))return!1;break}case this._operator.lshift:{if(!this._tryMemoryWrapper("lshift"))return!1;break}case this._operator.rshift:{if(!this._tryMemoryWrapper("rshift"))return!1;break}}c=""}}}return!0}},{key:"_tryMemoryWrapper",value:function _tryMemoryWrapper(a){try{for(var b,c=arguments.length,d=Array(1<c?c-1:0),e=1;e<c;e++)d[e-1]=arguments[e];(b=this._memory)[a].apply(b,d)}catch(a){return a instanceof _ErrorHandlers.MemoryError&&(this._callSelyaError(),console.log("".concat(a.name,": ").concat(a.message))),!1}return!0}},{key:"_callSelyaError",value:function _callSelyaError(){console.log("[Selya:".concat(this._currentPosition.line,":").concat(this._currentPosition.symbol,"]"))}},{key:"_throwUnrecognizedError",value:function _throwUnrecognizedError(){this._callSelyaError(),new _ErrorHandlers.ParserError("Unrecognized symbol","::UnrecognizedSymbol").log()}},{key:"_throwErrorOperatorTooSmall",value:function _throwErrorOperatorTooSmall(){this._callSelyaError(),new _ErrorHandlers.ParserError("Operator is too small","::SmallOperator").log()}},{key:"_throwUnknownOperatorError",value:function _throwUnknownOperatorError(){this._callSelyaError(),new _ErrorHandlers.ParserError("Unknown operator","::UnknownOperator").log()}},{key:"_throwOperatorNeededOperandError",value:function _throwOperatorNeededOperandError(){this._callSelyaError(),new _ErrorHandlers.ParserError("Operand expected","::UnexpectedOperator").log()}},{key:"_throwInvalidMemorySize",value:function _throwInvalidMemorySize(){this._callSelyaError(),new _ErrorHandlers.ParserError("Invalid memory size","::MemorySize").log()}}]),a}();exports.Parser=Parser;