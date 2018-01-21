const server = require('server');
const { get, post } = server.router;
const { file, redirect } = server.reply;

// For example
var filename = 'simple.pdf'

const home = get('/', ctx => 'index.html');

const api = [

	// Example
    get('/docs', ctx => file('doc/'+filename)),
   	// For test rest api create little form
    get('/api', ctx => file('public/form.html')),
    post('/api', ctx => {

    // Show the submitted data on the console:
    // ctx - context 
    // files - type 
    // profilepic - input name 

    // Here we can see all prop of our file
    // console.log(ctx.req.files.profilepic);    

    // There is name, size, type and path on server
    console.log(ctx.req.files.profilepic.name,'\n',
    			ctx.req.files.profilepic.size,'\n',
    			ctx.req.files.profilepic.type,'\n',
    			ctx.req.files.profilepic.path);
    // Redirect to main page
    return redirect('/');
  })
]

server(
	{
		port: 3000, 
		security: { csrf: false }
	}, 
	[home, api]
);