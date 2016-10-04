//Goal: learn the other helper functions of functionite
var functionite = require('../index.js');

/*
there are four methods of chaining functions together. you learned only "pass"
the four are "pass", "toss", "jump", and "skip"
here is the difference between the four

"pass": invokes the next function only when this function invokes their callback
        uses the values from the previous function's callback to feed into this function
"toss": invokes the next function only when this function invokes their callback
        doesn't use the values from the previous function's callback
"jump": invokes the next function as soon as this function is done running. doesn't wait for the callback
        uses the values from the previous function's callback to feed into this function
"skip": invokes the next function as soon as this function is done running. doesn't wait for the callback
        doesn't use the values from the previous function's callback

let's demonstrate this behavior
*/

//scenario 1
//"toss" will ignore values passed in from the previous function
//but will wait until the callback inside "add" is invoked before continuing
function add (a, b, cb) {
	cb(a + b);
}

functionite()
//add 2 and 5 together
.pass(add, 2, 5)
//toss the previous results, so 7 will not be sent to this "add" function
//therefore, you need to include two parameters
.toss(add, 4, 8)
//pass the results of the previous function to this one
.pass(function (sum) {
	console.log("Scenario 1: " + sum); //12
})
.go();

//scenario 2
//"skip" will call the next function as soon as the execution context leaves the function
//and will ignore anything passed in the callback
function longWait (message, timer, cb) {
	setTimeout(function () {
		console.log(message);
		cb("pang"); //always return "pang"
	}, timer); //wait one second before logging
}

functionite()
//wait for the callback before calling the next function
//"pong" will be logged in one second before continuing
//nothing is passed to "longWait" since there is no previous function that was called
.pass(longWait, "pong", 1000)
//invoke the next function when the execution context leaves this function
//"pong" will be logged in one second, but the next function will be executed in the meantime
//since we used "skip" we ignore the "pang" message that was passed in the callback
.skip(longWait, "pong", 1000)
//call longWait again and wait for the callback
//"ping" will be logged in .5 seconds before continuing
//note that since "skip" was called previously there is no way to get values from
//the previous function since functionite doesn't wait for the callback values
//therefore "pang" won't get passed into this function
.pass(longWait, "ping", 500)
//since a callback was specified on longWait, functionite is going to invoke that and cb will attempt to be called
//if "longWait" is the last function then functionite doesn't insert a callback so "longWait" will have an undefined cb
//that's why we need another function as the last one and that's why the last function never has a callback parameter
//now "pang" will have been passed thanks to the previous function, so we will get "pang" as our message after "ping"
.pass(function (message) {
	console.log(message);
})
.go(); //the result is "pong" "ping" "pang" "pong" over the course of 2 seconds

//scenario 3
//"jump" will call the next function as soon as the execution context leaves the function
//but will accept values passed in the callback
functionite()
//wait five seconds before "pung" is logged
.pass(longWait, "pung", 5000)
//"pang" is passed as a value in the callback, and "jump" doesn't ignore it
//so we automatically pass "pang" as the log message. "pang" is logged in .5 seconds
//but in the meantime functionite will execute the next function
.jump(longWait, 500)
.pass(function (message) {
	//nothing is passed in because "jump" doesn't wait for the callback function
	//to invoke to receive the value "pang". therefore, we get undefined
	console.log(message); 
})
.go(); //the result is "pung" "undefined" "pang" over the course of 5.5 seconds