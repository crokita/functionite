//Goal: learn how to resolve issues involving context
var functionite = require('../index.js');
var http = require('http');
var server = http.createServer(function (req, res) {
	res.end("hi");
});
/* 
functionite uses apply(), which means the context will be inevitably changed
functionite tries to avoid this as much as possible by setting the context
to the function object passed in. This will work for most cases, but for the following
use case it will not work

functionite()
.pass(server.listen, 4000)
.pass(function () {	
})
.go();

this is because for the context is expected to be "server" when 
server.listen is invoked but instead the context will be set to "server.listen"
you will know if this is a problem if you get an error of something like this:

"TypeError: self.once is not a function"

in this case you will need to change the context to "server" before using server.listen
*/

functionite()
.pass(server.listen, 4000).with(server) //use server.listen passing in the context of "server"
.pass(function () {
	console.log("server started");
})
.go();
//going to localhost:4000 will return the response "hi"