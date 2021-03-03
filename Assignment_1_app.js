const http = require('http');
const fs = require('fs')

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Greeting Page
    if(url === '/'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Greetings</title></head>');
        res.write('<body>');
        res.write('<h1><h1>Greetings From The Node.JS</h1></h1>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    // Create Page
    if(url === '/create'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>')
        res.write('<head><title>create node.js page</title></head>');
        res.write('<body>');
        res.write('<form action="/add" method="POST">');
        res.write('userName: ');
        res.write('<input type="text" name="userName"></input>');
        res.write('<br>');
        res.write('<button type="submit"> send </button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    // Code that works after submit button on the create page
    if(url === '/add' && method === 'POST'){
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            let message = parsedBody.split('=')[1];
            message =  message + "\n";
            fs.appendFile('usersFile.txt', message, err => {
                res.setHeader('Content-Type', 'text/html')
                res.write('<html>')
                res.write('<head><title>create node.js page</title></head>');
                res.write('<body>');
                res.write('<h2>User Name Added To File</h2>')
                res.write('</body>');
                res.write('</html>');
                return res.end();
            });
        });
    }

    // Users page which show all the users' name in the file on the response page.
    if(url === '/users'){
        if(fs.existsSync('./usersFile.txt')){
            let data = fs.readFileSync('usersFile.txt', 'utf8');
            let len = data.length;
            let user_array = data.split('\n');
            user_array.pop();
            if(len === 0){
                res.statusCode = 302;
                res.setHeader('Location', '/create');
                return res.end();
            }
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<body>');
            res.write('<head><title>User List</title></head>');
            res.write('<h1>User List</h1>')
            res.write('<ul>');
            for(const item of user_array){
                res.write('<li><h2>' + item + '</h2></li>');
            }
            res.write('</ul>')
            res.write('</body>');
            res.write('</html>');
            return res.end();
        }else{
            res.statusCode = 302;
            res.setHeader('Location', '/create');
            return res.end();
        }
    }
});

server.listen(3000);