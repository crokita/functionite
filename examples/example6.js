//Goal: access data generated from previous functions without passing them in as parameters
var functionite = require('../index.js');
//sometimes you have data that you would like to use in future async functions but don't want to pass 
//them to the future functions through a bunch of parameters. you don't need anything special to do this.
//simply define a variable outside functionite that you wish to assign values to and then in future
//functions reference that variable

//example
var store = {};

functionite()
.pass(function (callback) {
	var sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += i;
	}
	store.sum = sum;
	callback();
})
.pass(function () {
	console.log(store.sum);
})
.go();