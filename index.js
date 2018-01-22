const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// this saves your file into a directory called "doc"
const storage = multer.diskStorage({
  destination: 'doc/',
  filename: function(req, file, cb) {
    cb(null,file.fieldname - '-' + Date.now() + path.extname(file.originalname));
  }
}); 

const upload = multer({
    storage: storage
}).single('file-pdf');

// connect static files 
app.use(express.static(__dirname + '/doc/'))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/css'))
app.use(express.static(__dirname + '/public/js'))

// render index page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// dislpay pdf-file
app.get('/docs', function (req, res) {
    // for example we give you simple.pdf. I know its bad
    var filePath = "/doc/simple.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

// display test form
app.get('/upload', function(req,res){
        res.sendFile(path.join(__dirname + '/public/form.html'));
});

// save file 
app.post('/upload',(req, res) => {    
    upload(req,res,(err) => {
        if(err){
            console.log('err')
        } else {
            console.log(req.file)
            res.send('test')
        }
    })
});

// connect to port 3000
app.listen(3000, function () {
  console.log('Server start');
});