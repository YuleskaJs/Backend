const app = require('./server'); 

const { createServer } = require('node:http');
const server = createServer(app);

server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});