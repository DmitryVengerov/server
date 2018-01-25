const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');



var request = require('request')

var url = 'http://127.0.0.1:5984/'
var db = 'todolist/'
var id = 'document_id'

// Create a database/collection inside CouchDB
request.put(url + db, function(err, resp, body) {
    // Add a document with an ID
    request.put({
        url: url + db + id,
        body: { message: 'New Shiny Document', user: 'stefan' },
        json: true,
    }, function(err, resp, body) {
        // Read the document
        request(url + db + id, function(err, res, body) {
            console.log(typeof(body))
            console.log(body)
            console.log(body.user + ' : ' + body.message)
        })
    })
})



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


// connect static files 
app.use(express.static(__dirname + '/doc/'))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/css'))
app.use(express.static(__dirname + '/public/js'))

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

// connect to port 3000
app.listen(3000, () => {
    console.log('Server start');
});