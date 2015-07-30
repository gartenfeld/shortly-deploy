var app = require('./server-config.js');

var port = process.env.port || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);

//
console.log("Trying to figure out if we are on Azure, the port is: ", port);