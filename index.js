const express = require('express'),
    app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const request = require('request');
const bodyParser  = require('body-parser');
const nano = require('nano')('http://admin:admin@127.0.0.1:5984/');
var books = nano.db.use('simple');

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
// connect static files 
app.use(express.static(__dirname + '/doc/'))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/css'))
app.use(express.static(__dirname + '/public/js'))

/*
nano.db.list(function(err, body) {
    // body is an array
    body.forEach(function(db) {
        console.log('all databases ' + db);
    });
});

nano.db.get(function(err, body) {
    if (!err) {
        console.log('got database info', body);
    }
});

*/
/*
// clean up the database we created previously
nano.db.destroy('alice', function() {
    // create a new database
    nano.db.create('alice', function() {
        // specify the database we are going to use
        var alice = nano.use('alice');
        // and insert a document in it
        alice.insert({ crazy: true }, 'rabbit', function(err, body, header) {
            if (err) {
                console.log('[alice.insert] ', err.message);
                return;
            }
            console.log('you have inserted the rabbit.')
            console.log(body);
        });
    });
});

/*
nano.session(function(err, session) {
    if (err) {
        return console.log('oh noes!')
    }

    console.log('User is %s and has these roles: %j',
        session.userCtx.name, session.userCtx.roles);
});
*/

// this saves your file into a directory called "doc"
const storage = multer.diskStorage({
    destination: 'doc/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// check list for upload to server 
const upload = multer({
    storage: storage,
    limits: {
        // in bytes 
        filesize: 1000000
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('file-pdf');

// little one for check types of files
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpg|jpeg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime 
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only')
    }
}





app.post("/", function(req, res) {
    console.log(req.body.user.name)
});
// render index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// dislpay pdf-file
app.get('/docs', (req, res) => {
    // for example we give you simple.pdf. I know its bad
    var filePath = "/doc/simple.pdf";

    fs.readFile(__dirname + filePath, (err, data) => {
        res.contentType("application/pdf");
        res.send(data);
    });
});

// display test form
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/form.html'));
});

// save file 
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log('err')
        } else {
            if (req.file == undefined) {
                console.log('No file selected')
            } else {
                console.log('file upload to doc/' + req.file.filename);
            }
        }
    })
});

// login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

// login form
app.post('/login', (req, res) => {
    console.log(req.body.user.name);
    console.log(req.body.user.email);
});



// connect to port 3000
app.listen(3000, () => {
    console.log('Server start');
});