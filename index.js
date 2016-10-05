(function() {

	var root = this;

	//given an object, converts it to an array and returns the array
	function objToArray (obj) {
		var arr = [];
		for (var key in obj) {
			arr.push(obj[key]);
		}
		return arr;
	}

	function functionite (func) {
		//if a function is passed in, convert it into a function that returns
		//the result in a callback and return that function
		if (typeof func === "function") {
			var newFunc = function () {
				var argArray = objToArray(arguments);
				//don't include the last argument when passing into the function, as that is the callback function 
				var result = func.apply(func, argArray.slice(0, argArray.length - 1));
				//use the callback that should've been passed in (the last parameter)
				argArray[argArray.length - 1](result);
			}
			return newFunc;
		}
		//otherwise, build an object made for easily chaining asynchronous functions together
		var helper = {};
		//an array of functions to invoke in order
		helper.queue = [];
		//pass will include called back arguments and will wait for the callback
		helper.pass = function () {
			console.log(arguments);
			makeQueueObj(arguments, true, true);
			return helper;
		}
		//pass won't include called back arguments and will wait for the callback
		helper.toss = function () {
			makeQueueObj(arguments, false, true);
			return helper;
		}
		//jump will include called back arguments and won't wait for the callback
		helper.jump = function () {
			makeQueueObj(arguments, true, false);
			return helper;
		}
		//skip won't include called back arguments and won't wait for the callback
		helper.skip = function () {
			makeQueueObj(arguments, false, false);
			return helper;
		}
		//overrides the context of the previous function passed
		helper.with = function (context) {
			helper.queue[helper.queue.length - 1].context = context;
			return helper;
		}

		function makeQueueObj (args, pass, wait) {
			var argArray = objToArray(args);
			var finalFunction = argArray[0];
			var context = finalFunction; //set the context to the function passed in when using "apply"
			//push the function, the arguments and the behavior "pass" to the queue
			//first argument is the function, so don't add that in args array
			helper.queue.push({
				pass: pass,
				wait: wait,
				args: argArray.slice(1, argArray.length),
				context: context,
			    f: finalFunction
			});
		}

		//invoke all the functions in the queue
		helper.go = function (cb) {
			//start invoking functions
			invoke();
		}

		function invoke (returnArgs) {
			var argArray = objToArray(returnArgs);
			//get the next function off the queue
			var queueObj = helper.queue.shift();
			//concatenate the return values of the previous function and the arguments of this one
			//ONLY if the function has pass enabled
			var totalArgs;
			if (queueObj.pass) {
				totalArgs = argArray.concat(queueObj.args);
			}
			else {
				totalArgs = queueObj.args;
			}
			//apply the args to the function, including a callback function
			//so that when the function is done we pass the results to the next function
			var cbFunc = function () {
				//invoke the next function
				invoke(arguments);
			}
			//only if there's more functions to execute, then add cbFunc so invoke gets called again
			if (helper.queue.length !== 0) { 
				//if wait is enabled, use cbFunc to call the next function only when the previous one is done
				if (queueObj.wait) { 
					totalArgs.push(cbFunc);
				}
				else { //don't wait for the next function to be done. pass in empty callback
					totalArgs.push(function(){});
				}
			}
			queueObj.f.apply(queueObj.context, totalArgs);
			//immediately call the next function after this one. next function won't have called back arguments
			if (!queueObj.wait) { 
				invoke();
			}
		}
		return helper;
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