(function() {

	var root = this;

	function objToArray (obj) {
		var arr = [];
		for (var key in obj) {
			arr.push(obj[key]);
		}
		return arr;
	}

	function functionite (func) {
		var stack = [];
		stack.to = function () {
			var stackFunc = {
				f: arguments[0],
				args: objToArray(arguments).slice(1)
			};
			stack.push(stackFunc);
			return stack;
		};
		stack.then = function (cb) {
			var funcObj = stack.shift();
			for (var arg in funcObj.args) {
				funcObj.f = funcObj.f.bind(this, funcObj.args[arg]);
			}
			funcObj.f(function () {
				if (stack.length !== 0) {
					stack[0].args = objToArray(arguments).concat(stack[0].args);
					stack.then(cb);
				}
				else {
					cb(objToArray(arguments));
				}
			});
		};
		//if a function is passed in, convert the function into something that can be used with functionite
		if (func) {
			var newFunc = function () {
				//move this apply function's result into this variable. 
				//subtituting the result variable in the second line causes a bug for browsers
				var result = func.apply(this, objToArray(arguments).slice(0, -1));
				arguments[arguments.length - 1](result);
			}
			return newFunc;
		}
		else {
			return stack;
		}
	}
	//add compatability with browser and with nodejs
	//from http://underscorejs.org/docs/underscore.html
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
		  	exports = module.exports = functionite;
		}
		exports.functionite = functionite;
	} else {
		root.functionite = functionite;
	}
})();