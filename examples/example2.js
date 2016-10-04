//Goal: learn how to pass a result of an asynchronous functions to other asynchronous functions
var functionite = require('../index.js');

//treat the following two functions as asynchronous.
//we want to add two numbers together, and then multiply the result by another number
//and then print that result
function add (a, b, cb) {
	cb(a + b);
}
function multiply (a, b, cb) {
	cb(a * b);
}
//the last function that is in the chain doesn't have to have a callback
//we will use "print" to print the result of previous operations
function print (result) {
	console.log(result);
}

//the helper function "pass" will use the values passed in the callback
//of the previous function and become the first arguments
//of the next function

//initialize a function chain
functionite()
//add two and three together. "pass" is used here but there are no previous
//callback values to insert into "add" so we still need two parameters
.pass(add, 2, 3)
//the add function returns the sum through a callback
//therefore that value will be passed to "multiply" so now we
//only need one more parameter before "multiply" will work correctly
.pass(multiply, 4)
//the two values are multiplied and the result is returned in another callback
//"print" only accepts one parameter and that will be the result of the multiplication
//therefore we don't need to add any other parameters here
.pass(print)
//up until this point none of these functions are actually invoked. functionite
//stores these functions and the method of invoking them until we call the
//"go" helper function. running this code should return the result (2+3)*4
.go();