/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _questions = __webpack_require__(/*! ./questions */ 1);
	
	var _questions2 = _interopRequireDefault(_questions);
	
	var _Condition = __webpack_require__(/*! ./Condition */ 3);
	
	var _Condition2 = _interopRequireDefault(_Condition);
	
	var _renderQuestion = __webpack_require__(/*! ./renderQuestion */ 5);
	
	var _renderQuestion2 = _interopRequireDefault(_renderQuestion);
	
	var _renderCondition = __webpack_require__(/*! ./renderCondition */ 6);
	
	var _renderCondition2 = _interopRequireDefault(_renderCondition);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global $ */
	
	__webpack_require__(/*! ../styles/index.scss */ 7);
	
	function getCookie(name) {
	  var cookieValue = null;
	  if (document.cookie && document.cookie != '') {
	    var cookies = document.cookie.split(';');
	    for (var i = 0; i < cookies.length; i++) {
	      var cookie = jQuery.trim(cookies[i]);
	      // Does this cookie string begin with the name we want?
	      if (cookie.substring(0, name.length + 1) == name + '=') {
	        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	        break;
	      }
	    }
	  }
	  return cookieValue;
	}
	
	$.ajaxSetup({ headers: { 'X-CSRFToken': getCookie('csrftoken') } });
	
	function init() {
	  var activeQuestion = 0;
	  (0, _renderQuestion2.default)(activeQuestion);
	
	  $('#load-next').click(function () {
	    if (activeQuestion === _questions2.default.length - 1) {
	      return;
	    }
	    activeQuestion++;
	    (0, _renderQuestion2.default)(activeQuestion);
	  });
	
	  $('#load-prev').click(function () {
	    if (activeQuestion === 0) {
	      return;
	    }
	    activeQuestion--;
	    (0, _renderQuestion2.default)(activeQuestion);
	  });
	
	  $('#submit').click(function () {
	    /*
	      Invalid fLow reasons:
	        1. No default condition
	        2. No destination set in condition
	        3. Incorrect destination question set in condition
	        4. No value for testing set in condition
	    */
	
	    var isValid = true;
	
	    var noDefaultConditionQuestions = _questions2.default.filter(function (q) {
	      return q.conditions.length === 0;
	    });
	
	    if (noDefaultConditionQuestions.length) {
	      isValid = false;
	      alert('At least default condition must be set:\n' + noDefaultConditionQuestions.map(function (q) {
	        return 'Q ' + (1 + q.idx) + ')';
	      }).join('\n') + '\n    ');
	    }
	
	    _questions2.default.forEach(function (q) {
	      var noToQuestions = q.conditions.filter(function (c) {
	        return !c.to;
	      });
	
	      if (noToQuestions.length) {
	        isValid = false;
	        alert('No destination question set:\n' + noToQuestions.map(function (c) {
	          return 'Q ' + (1 + q.idx) + ') -> ' + (c.idx ? 'Condition ' + c.idx : 'Default condition');
	        }).join('\n') + '\n      ');
	      }
	
	      var incorrectToQuestions = q.conditions.filter(function (c) {
	        return c.to < 0 || c.to > _questions2.default.length;
	      });
	
	      if (incorrectToQuestions.length) {
	        isValid = false;
	        alert('Incorrect destination question set:\n' + incorrectToQuestions.map(function (c) {
	          return 'Q ' + (1 + q.idx) + ') -> ' + (c.idx ? 'Condition ' + c.idx : 'Default condition');
	        }).join('\n') + '\n      ');
	      }
	
	      var noValueQuestions = q.conditions.slice(1).filter(function (c) {
	        return !c.value;
	      });
	
	      if (noValueQuestions.length) {
	        isValid = false;
	        alert('Destination value for condition must be set:\n' + noValueQuestions.map(function (c) {
	          return 'Q ' + (1 + q.idx) + ') - ' + c.idx;
	        }).join('\n') + '\n      ');
	      }
	    });
	
	    if (isValid) {
	      var data = _questions2.default.reduce(function (_data, q) {
	        _data[q._id.$oid] = q.conditions.map(function (_ref) {
	          var to = _ref.to,
	              value = _ref.value;
	
	          return {
	            to: to < _questions2.default.length ? _questions2.default[to]._id.$oid : -1,
	            value: value
	          };
	        });
	
	        return _data;
	      }, {});
	
	      $.ajax({
	        type: 'POST',
	        url: '.',
	        data: {
	          evaluation_scheme: JSON.stringify(data)
	        },
	        success: function success() {
	          alert('SUCCESS!!');
	          location.pathname = '/survey/view/';
	        },
	        error: function error(err) {
	          alert('Some error occured');
	          throw err;
	        }
	      });
	      // }, () => (location.pathname = '/survey/view/'));
	    }
	
	    // questions.forEach((q) => {
	    //   q.eval_scheme = q.conditions.map(({ from, to, value }) =>
	    //     ({ from, to, value }));
	    // });
	  });
	
	  $('.add-condition').click(function () {
	    var question = _questions2.default[activeQuestion];
	    var condition = new _Condition2.default(question);
	    question.conditions.push(condition);
	    (0, _renderCondition2.default)(condition);
	  });
	}
	
	$.post('.', { questions: 1 }, function (response) {
	  JSON.parse(response.questions).forEach(function (q, i) {
	    _questions2.default.push(_extends({}, q, {
	      idx: i,
	      conditions: [],
	      element: undefined
	    }));
	  });
	
	  init();
	});
	
	$('.add-condition.btn').click();
	$('#score').focus();

/***/ },
/* 1 */
/*!**********************************!*\
  !*** ./src/scripts/questions.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _QuestionTypes = __webpack_require__(/*! ./QuestionTypes */ 2);
	
	var _QuestionTypes2 = _interopRequireDefault(_QuestionTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var questions = [];
	
	exports.default = questions;

/***/ },
/* 2 */
/*!**************************************!*\
  !*** ./src/scripts/QuestionTypes.js ***!
  \**************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var questionTypes = {
	  dual: 'dual',
	  dropdownbox: 'dropdownbox',
	  radio: 'radio',
	  checkbox: 'checkbox',
	  rating: 'rating',
	  text: 'text'
	};
	
	exports.default = questionTypes;

/***/ },
/* 3 */
/*!**********************************!*\
  !*** ./src/scripts/Condition.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $ */
	
	var _QuestionTypes = __webpack_require__(/*! ./QuestionTypes */ 2);
	
	var _QuestionTypes2 = _interopRequireDefault(_QuestionTypes);
	
	var _Score = __webpack_require__(/*! ./Score */ 4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Condition = function () {
	  function Condition(question) {
	    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	    _classCallCheck(this, Condition);
	
	    this.question = question;
	    this.idx = question.conditions.length;
	    this.default = type === 'default';
	
	    this.from = question.idx;
	    this.to = 1 + question.idx;
	    this.value = undefined;
	
	    this.scoreCondition = null;
	
	    console.log(question.query_type, _QuestionTypes2.default.checkbox);
	    if (type !== 'default') {
	      switch (question.query_type) {
	        case _QuestionTypes2.default.text:
	          this.text();
	          break;
	
	        case _QuestionTypes2.default.radio:
	          this.radio();
	          break;
	
	        case _QuestionTypes2.default.checkbox:
	          this.checkbox();
	          break;
	
	        case _QuestionTypes2.default.dual:
	          this.dual();
	          break;
	
	        case _QuestionTypes2.default.rating:
	          this.rating();
	          break;
	
	        case _QuestionTypes2.default.dropdownbox:
	          this.dropdownbox();
	          break;
	
	        default:
	      }
	
	      // this.score();
	    }
	  }
	
	  _createClass(Condition, [{
	    key: 'text',
	    value: function text() {
	      var _this = this;
	
	      var $element = $('\n      <div class="col-md-10 col-md-offset-1">\n        <div class="from-group">\n          <label class="col-md-3 control-label">Value:</label>\n          <div class="col-md-9">\n            <input type="text" class="form-control" name="value" placeholder="Condition value" />\n          </div>\n        </div>\n      </div>\n    ');
	
	      $element.find('input').change(function (e) {
	        _this.value = e.target.value;
	      });
	
	      this.element = $element;
	    }
	  }, {
	    key: 'radio',
	    value: function radio() {
	      var _this2 = this;
	
	      var $element = $('\n      <div class="col-md-10 col-md-offset-1">\n        <div class="form-group">\n          <div class="radio">\n          </div>\n        </div>\n      </div>\n    ');
	      for (var i = 0; i < this.question.options.length; i++) {
	        $element.find('.radio').append('\n        <div class="col-md-2">\n          <label class="radio-inline">\n            <input type="radio" name="value" value="' + i + '" />\n            <span>Option ' + String.fromCharCode(65 + i) + '</span>\n          </label>\n        </div>\n      ');
	      }
	      $element.find('input[name="value"]').change(function (e) {
	        _this2.value = e.target.value;
	      });
	      this.element = $element;
	    }
	  }, {
	    key: 'checkbox',
	    value: function checkbox() {
	      var _this3 = this;
	
	      var $element = $('\n      <div class="col-md-10 col-md-offset-1">\n        <div class="form-group">\n          <div class="checkbox">\n          </div>\n        </div>\n      </div>\n    ');
	      for (var i = 0; i < this.question.options.length; i++) {
	        $element.find('.checkbox').append('\n        <div class="col-md-2">\n          <label class="checkbox-inline">\n            <input type="checkbox" name="value" value="' + i + '" />\n            <span>Option ' + String.fromCharCode(65 + i) + '</span>\n          </label>\n        </div>\n      ');
	      }
	      $element.find('input[name="value"]').change(function () {
	        var checkboxes = $element.find('input[type="checkbox"]');
	        var checked = [];
	        for (var _i = 0; _i < checkboxes.length; _i++) {
	          checked.push(checkboxes[_i].checked);
	        }
	        _this3.value = checked;
	      });
	      this.element = $element;
	    }
	  }, {
	    key: 'dual',
	    value: function dual() {
	      var _this4 = this;
	
	      var $element = $('\n      <div class="col-md-10 col-md-offset-1">\n        <div class="form-group">\n          <div class="radio">\n          </div>\n        </div>\n      </div>\n    ');
	      for (var i = 0; i < 2; i++) {
	        $element.find('.radio').append('\n        <div class="col-md-2">\n          <label class="radio-inline">\n            <input type="radio" name="value" value="' + i + '" />\n            <span>Option ' + String.fromCharCode(65 + i) + '</span>\n          </label>\n        </div>\n      ');
	      }
	      $element.find('input[name="value"]').change(function (e) {
	        _this4.value = e.target.value;
	      });
	      this.element = $element;
	    }
	  }, {
	    key: 'rating',
	    value: function rating() {
	      var _this5 = this;
	
	      var $element = $('\n      <div class="col-md-10 col-md-offset-1">\n        <div class="from-group">\n          <label class="col-md-3 control-label">Value:</label>\n          <div class="col-md-2">\n            <select class="form-control" name="value" title="Condition value">\n              <option value="1">1</option>\n              <option value="2">2</option>\n              <option value="3">3</option>\n              <option value="4">4</option>\n              <option value="5">5</option>\n              <option value="6">6</option>\n              <option value="7">7</option>\n              <option value="8">8</option>\n              <option value="9">9</option>\n              <option value="10">10</option>\n            </select>\n          </div>\n        </div>\n      </div>\n    ');
	
	      $element.find('select').change(function (e) {
	        _this5.value = e.target.value;
	      });
	      this.value = '1';
	
	      this.element = $element;
	    }
	  }, {
	    key: 'dropdownbox',
	    value: function dropdownbox() {
	      var _this6 = this;
	
	      var $element = $('\n      <div class="col-md-10 col-md-offset-1">\n        <div class="form-group">\n          <div class="radio">\n          </div>\n        </div>\n      </div>\n    ');
	      for (var i = 0; i < this.question.options.length; i++) {
	        $element.find('.radio').append('\n        <div class="col-md-2">\n          <label class="radio-inline">\n            <input type="radio" name="value" value="' + i + '" />\n            <span>Option ' + String.fromCharCode(65 + i) + '</span>\n          </label>\n        </div>\n      ');
	      }
	      $element.find('input[name="value"]').change(function (e) {
	        _this6.value = e.target.value;
	      });
	      this.element = $element;
	    }
	  }, {
	    key: 'score',
	    value: function score() {
	      var _this7 = this;
	
	      var $scoreInput = $('\n      <input\n        type="text"\n        class="form-control"\n        id="score"\n        placeholder="Score condition"\n      >')[0];
	      $scoreInput.onfocus = function () {
	        $('#score-modal').modal();
	        $('#score-modal').data('curr', _this7.from + '/' + _this7.idx);
	        $('#score-modal .modal-body').html(_Score.addGroupBtn);
	      };
	
	      var $scoreElement = $('\n      <div class="from-group">\n        <label class="col-md-3 control-label">Score:</label>\n        <div class="col-md-9"></div>\n      </div>\n    ');
	
	      $scoreElement.find('div').append($scoreInput);
	
	      this.element.append($scoreElement);
	    }
	  }]);
	
	  return Condition;
	}();
	
	exports.default = Condition;

/***/ },
/* 4 */
/*!******************************!*\
  !*** ./src/scripts/Score.js ***!
  \******************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* global $ */
	
	var conditionOperators = {
	  'lesser than': 'lt',
	  'greater than': 'gt',
	  'equal to': 'eq'
	};
	
	var groupOperators = {
	  and: 'and',
	  or: 'or'
	};
	
	function condition(operator, value) {
	  var negate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	
	  return {
	    operator: operator,
	    value: value,
	    negate: negate
	  };
	}
	
	function group(conditions) {
	  var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	  return {
	    conditions: conditions,
	    operator: operator
	  };
	}
	
	function evaluate(x, expr) {
	  if ('conditions' in expr) {
	    return expr.conditions.map(function (c) {
	      return evaluate(x, c);
	    }).reduce(function (result, cResult) {
	      switch (expr.operator) {
	        case 'and':
	          return result && cResult;
	
	        case 'or':
	          return result || cResult;
	
	        default:
	          console.error('Invalid group operator:', expr);
	          return -1;
	      }
	    });
	  }
	
	  switch (expr.operator) {
	    case 'lt':
	      return expr.negate ? x >= expr.value : x < expr.value;
	
	    case 'gt':
	      return expr.negate ? x <= expr.value : x > expr.value;
	
	    case 'eq':
	      return expr.negate ? x !== expr.value : x === expr.value;
	
	    default:
	      console.error('Invalid condition operator:', expr);
	      return -1;
	  }
	}
	
	var state = {
	  groupCount: 0,
	  conditionCount: 0
	};
	
	function addCondition(groupIdx) {
	  var $conditionElement = $('\n    <div style="background-color:#ddd;">\n      <label>\n        Score:\n      </label>\n\n      <select>\n        ' + Object.keys(conditionOperators).map(function (op) {
	    return '<option>\n            ' + op + '\n          </option>';
	  }).join('') + '\n      </select>\n\n      <input type="number" id="value" placeholder="Value" title="Value">\n\n      <input type="checkbox" id="negate" title="Negate">\n    </div>\n  ');
	
	  $('#score-expression-group-' + groupIdx).append($conditionElement);
	  console.log(groupIdx);
	}
	
	function addGroup() {
	  var idx = state.groupCount++;
	  var $groupElement = $('\n    <div\n      class="score-expression-group" id="score-expression-group-' + idx + '"\n      style="background-color:#eee;"\n    >\n      <select id="operator">\n        <option value=\'and\'>and</option>\n        <option value=\'or\'>or</option>\n      </select>\n    </div>\n  ');
	
	  var btn = $('<button> + </button>')[0];
	  btn.onclick = function () {
	    return addCondition(idx);
	  };
	  $groupElement.append(btn);
	  $('#score-modal .modal-body').append($groupElement);
	}
	
	var addGroupBtn = $('<button title="Add Group">+</button>')[0];
	addGroupBtn.onclick = addGroup;
	
	exports.addGroupBtn = addGroupBtn;

/***/ },
/* 5 */
/*!***************************************!*\
  !*** ./src/scripts/renderQuestion.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderQuestion;
	
	var _QuestionTypes = __webpack_require__(/*! ./QuestionTypes */ 2);
	
	var _QuestionTypes2 = _interopRequireDefault(_QuestionTypes);
	
	var _questions = __webpack_require__(/*! ./questions */ 1);
	
	var _questions2 = _interopRequireDefault(_questions);
	
	var _Condition = __webpack_require__(/*! ./Condition */ 3);
	
	var _Condition2 = _interopRequireDefault(_Condition);
	
	var _renderCondition = __webpack_require__(/*! ./renderCondition */ 6);
	
	var _renderCondition2 = _interopRequireDefault(_renderCondition);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global $ */
	
	window.questions = _questions2.default;
	function renderQuestion(i) {
	  var question = _questions2.default[i];
	
	  $('.question .heading').text('Q' + (1 + i) + ')');
	  $('.question .body > p').text(question.text);
	
	  switch (question.query_type) {
	    case _QuestionTypes2.default.radio:
	    case _QuestionTypes2.default.checkbox:
	    case _QuestionTypes2.default.dropdownbox:
	      $('.question .body .options').html(question.options.map(function (o, j) {
	        return '<p>\n          ' + String.fromCharCode(65 + j) + ') ' + o.text + '\n        </p>';
	      }).join(' '));
	      break;
	
	    case _QuestionTypes2.default.dual:
	      $('.question .body .options').html(['Yes', 'No'].map(function (o, j) {
	        return '<p>\n          ' + String.fromCharCode(65 + j) + ') ' + o + '\n        </p>';
	      }).join(' '));
	      break;
	
	    default:
	      $('.question .body .options').empty();
	  }
	
	  if (question.conditions.length === 0) {
	    var defaultCondition = new _Condition2.default(question, 'default');
	    question.conditions.push(defaultCondition);
	  }
	
	  (0, _renderCondition2.default)(question.conditions[0]);
	  question.conditions.slice(1).forEach(function (c) {
	    return (0, _renderCondition2.default)(c);
	  });
	}

/***/ },
/* 6 */
/*!****************************************!*\
  !*** ./src/scripts/renderCondition.js ***!
  \****************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = renderCondition;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	/* global $ */
	
	function deleteCondition(condition) {
	  condition.question.conditions = [].concat(_toConsumableArray(condition.question.conditions.slice(0, condition.idx)), _toConsumableArray(condition.question.conditions.slice(1 + condition.idx)));
	  condition.handle.remove();
	  if (condition.idx < condition.question.conditions.length) {
	    render(condition.question.conditions[condition.idx]);
	  } else {
	    console.log(condition.question.conditions.slice(-1)[0]);
	    render(condition.question.conditions.slice(-1)[0]);
	  }
	}
	
	function render(condition) {
	  if (condition.default) {
	    $('.condition .heading #idx').text('Default');
	    $('.condition .heading #close').hide();
	    $('.condition .body .data').empty();
	  } else {
	    $('.condition .heading #idx').text('Condition ' + condition.idx);
	    $('.condition .heading #close').show();
	    $('.condition .body .data').html(condition.element);
	    $('.condition .heading #close')[0].onclick = function () {
	      return deleteCondition(condition);
	    };
	  }
	
	  $('.condition .heading #from').val(1 + condition.from);
	  $('.condition .heading #to').val(1 + condition.to);
	}
	
	function renderCondition(condition) {
	  $('.condition .heading #to')[0].onchange = function (e) {
	    condition.to = +e.target.value.length ? +e.target.value - 1 : '';
	  };
	
	  var $handle = $('<button class="btn">' + (condition.default ? 'D' : condition.idx) + '</button>');
	  $handle.click(function () {
	    render(condition);
	  });
	  condition.handle = $handle;
	
	  if (condition.default) {
	    $('.add-condition + span').html($handle);
	  } else {
	    $('.add-condition + span').append($handle);
	  }
	  render(condition);
	}

/***/ },
/* 7 */
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map