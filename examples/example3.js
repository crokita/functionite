//Goal: pass in multiple values from callbacks to the next function
var functionite = require('../index.js');

//callback functions can be passed any number of parameters
//functionite will let you use functions that do this
//here is an example. find the sum of pointA, pointB, and pointC's x and y values
var pointA_X = 20;
var pointA_Y = 10;
var pointB_X = -30;
var pointB_Y = 40;
var pointC_X = 50;
var pointC_Y = -40;

//this function takes the sum of two points, and returns the 
//sum of x's and the sum of y's in a callback
function addPoints (x1, y1, x2, y2, cb) {
	var xFinal = x1 + x2;
	var yFinal = y1 + y2;
	cb(xFinal, yFinal);
}

functionite()
//pass in point A and point B coordinates
.pass(addPoints, pointA_X, pointA_Y, pointB_X, pointB_Y)
//the two results of addPoints will be passed to the next function's arguments
//only include point C's coordinates now for a total of four arguments
.pass(addPoints, pointC_X, pointC_Y)
//after all of this is done, the final result should be two values returned in the next function
//pass in a function to print those two values
.pass(function (finalX, finalY) {
	console.log("x: " + finalX); //40
	console.log("y: " + finalY); //10
})
.go();