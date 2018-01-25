var nano = require('nano')('http://127.0.0.1:5984/');
var books = nano.db.use('simple');

//Insert a book document in the books database

//Get a list of all books
books.list(function(err, body){
	console.log(typeof(body))
 	console.log(body);
});