const express = require('express'),
  app = express()
const path = require('path')
const url = require('url')
const fs = require('fs')
const multer = require('multer')
const request = require('request')
const bodyParser = require('body-parser')
const nano = require('nano')('http://admin:admin@127.0.0.1:5984/')
const users = nano.use('users')

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(express.static(__dirname + '/doc/'))
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public/css'))
app.use(express.static(__dirname + '/public/js'))
const storage = multer.diskStorage({
  destination: 'doc/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
// check list for upload to server
const upload = multer({
  storage: storage,
  limits: {
        // in bytes
    filesize: 1000000
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
}).single('file-pdf')
// little one for check types of files
function checkFileType (file, cb) {
    // Allowed ext
  const filetypes = /jpg|jpeg|png|gif/
    // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images only')
  }
}
function checkUser (data) {
  users.get(data.name, (err, body) => {
    if (err) {
      console.log('we can add')
      return true
    } else {
      console.log('we already have')
      return false
    }
  })
}
function usersAdd (data) {
  users.insert({ mail: data.email }, data.name, (err, body, header) => {
    if (err) {
      console.log('[users.insert]', err.message)
      return
    }
    console.log('you have inserted new user.')
    console.log(body)
  })
}
function displayFile (fileNameUser) {
    // generate url for display
  var filePath = '/docs/' + fileNameUser
  app.get(filePath, (req, res) => {
        // host file system
    var filePath = '/doc/' + fileNameUser
    fs.readFile(__dirname + filePath, (err, data) => {
      res.contentType('application/pdf')
      res.send(data)
    })
  })
}
function api () {
  app.get('/api/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/form.html'))
  })
    // save file
  app.post('/api/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        console.log('err')
      } else {
        if (req.file == undefined) {
          console.log('No file selected')
        } else {
          console.log('file upload to doc/' + req.file.filename)
        }
      }
    })
  })
    // login form
  app.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'))
  })
    // login form
  app.post('/api/login', (req, res) => {
    if (!checkUser(req.body.user) == true) {
      console.log(req.body.user.name)
      console.log(req.body.user.email)
      usersAdd(req.body.user)
    }
  })
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
  })
  app.post('/', (req, res) => {
    console.log(req.body.user.name)
  })
}
// connect to port 3000
app.listen(3000, () => {
  console.log('Server start')
  displayFile('simple_1.pdf')
  api()
})
