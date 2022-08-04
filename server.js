const app = require('express')();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origins: "*:*",
    }
});
const port = 2499;
const colors = require('colors');

const control = require('@nut-tree/nut-js');

var isMouseClicked = false;
require('dns').lookup(require('os').hostname(), function (err, localAddress, fam) {
    io.on('connection', (socket) => {
        console.log('[+] Client Connected'.cyan);
        socket.on('message', async (message) => {
            var obj = JSON.parse(message);
            var deltaX = obj.deltaX;
            var deltaY = obj.deltaY;
            var clicking = obj.mouseClicked;

            console.log(`(i) Received Mouse DeltaPosition: X:${deltaX}, Y:${deltaY}`.yellow);

            var mouseX = await control.mouse.getPosition().then(function (result) { return result.x; });
            var mouseY = await control.mouse.getPosition().then(function (result) { return result.y; });

            // if (clicking) {
            //     control.mouse.pressButton(control.Button.LEFT);
            // } else {
            //     // control.mouse.releaseButton(control.Button.LEFT);
            // }
            var scale = 1.1;
            control.mouse.setPosition(new control.Point(mouseX + deltaX * scale, mouseY + deltaY * scale));
        });
        socket.on('dblclick', async (message) => {
            console.log(`+(i) Received Mouse DoubleClick`.yellow);
            control.mouse.leftClick();
        });
    });

    io.on('listening', () => {
        console.log(`[+] Server Started on http://${localAddress}:${port}\n`.green, port);
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/client/index.html');
    });

    app.get('/index.js', (req, res) => {
        res.sendFile(__dirname + '/client/index.js');
    });

    app.get('/life.js', (req, res) => {
        res.sendFile(__dirname + '/client/life.js');
    });

    app.get('/events.js', (req, res) => {
        res.sendFile(__dirname + '/client/events.js');
    });

    app.get('/socketio.js', (req, res) => {
        res.sendFile(__dirname + '/client/socketio.js');
    });

    app.get('/style.css', (req, res) => {
        res.sendFile(__dirname + '/client/style.css');
    });

    io.listen(port);


    app.listen(port + 1, () => {
        console.log((`(i) - Client: (` + colors.underline(`http://${localAddress}:${port + 1}`) + `)\n`).green);
    });
});
