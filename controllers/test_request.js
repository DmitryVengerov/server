const router = express.Router()

var url = 'http://127.0.0.1:5984/'
// db name 
var db = 'todolist/'
var id = 'document_id'

var _session = 'http://127.0.0.1:5984/_utils/session.html'

// Create a database/collection inside CouchDB

request.put(url + db, (err, resp, body) => {
    // Add a document with an ID
    request.put({
        url: url + db + id,
        body: { message: 'New Shiny Document', user: 'stefan' },
        json: true,
    }, (err, resp, body) => {
        // Read the document
        request(url + db + id, (err, res, body) => {
            // string
            console.log(typeof(body))
            console.log(body)
        })
    })
})
