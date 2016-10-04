//Goal: initialize functionite and convert a synchronous function to use callbacks to return their result
var functionite = require('../index.js');
//functionite allows you to pass results of asynchronous functions easily
//functionite must be initialized before you can pass functions to it
//you do this by calling functionite() with no arguments passed in
//you will get a helper object in return with a bunch of extra functions you can call
var helper = functionite();
//functions that are synchronous can return results in a callback by passing the 
//function in when you initialize functionite

//a synchronous function
function multiply (a, b) {
	return a*b;
}

//now the function has a callback. in this scenario functionite returns the function passed in
//with a callback instead of the helper functions
//you will need to call functionite() again in order to do that
var multiplyCallback = functionite(multiply);
//you can now use the multiply function like so
multiplyCallback(2, 6, function (result) {
	console.log(result);
});

//the reason why this exists is because functionite only deals with functions 
//whose final parameter is a callback. Passing in "multiply" to functionite would not work