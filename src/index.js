const app = require('./server');  // Aquí solo importas el app

const { createServer } = require('node:http');
const server = createServer(app);

server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});