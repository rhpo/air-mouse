import { World, Shape, id, Text, image } from './life.js';
import socketIO from './socketio.js';

window['Shape'] = Shape;

const io = socketIO(`http://${location.hostname}:2499`);

const world = new World({
    pattern: 'color',
    G: {
        x: 0,
        y: 0
    },
    border: {
        color: 'white',
        width: 1
    },
    hasLimits: false,
    background: 'white'
});

window['world'] = world;

var Width = 1;

const y = new Shape({
    type: 'rectangle',
    pattern: 'color',
    x: 0,
    y: 0,
    width: world.canvas.width,
    height: Width,
    background: 'black',
});

const x = new Shape({
    type: 'rectangle',
    pattern: 'color',
    x: 0,
    y: 0,
    width: Width,
    height: world.height,
    background: 'black',
});

var mouseClicked = false;
var lastTouch = {};
var dx = 0;
var dy = 0;
var button = document.querySelector('.left');

io.on('native-click', e => {
    Text({
        text: `Native Click`,
        x: 10,
        y: 90,
        background: 'black'
    });
});

function main() {
    world.update();

    world.canvas.ontouchstart = function (e) {
        lastTouch = e.touches[0];
    }

    world.canvas.ondblclick = function (e) {
        // io.emit('dblclick', JSON.stringify({}));
        world.Objects = world.Objects.filter(obj => obj.tag !== 'drawing');
    }

    world.canvas.ontouchend = () => {
        world.Objects = world.Objects.filter(obj => obj.tag !== 'drawing');
    }

    world.canvas.ontouchmove = () => {
        if (lastTouch.x !== undefined) {
            dx = world.mouse.x - lastTouch.x;
            dy = world.mouse.y - lastTouch.y;
            io.emit('message', JSON.stringify({
                deltaX: dx + 1,
                deltaY: dy + 1,
                mouseClicked: mouseClicked
            }));
            x.x = world.mouse.x;
            y.y = world.mouse.y;
        }
        new Shape({
            type: 'line',
            pattern: 'color',
            VEC2: {
                x1: world.mouse.x,
                y1: world.mouse.y,
                x2: world.mouse.x + dx,
                y2: world.mouse.y + dy,
            },
            background: 'black',
            width: 15,
            physics: false,
            tag: 'drawing'
        });
        lastTouch.x = world.mouse.x;
        lastTouch.y = world.mouse.y;
    }

    Text({
        text: 'x: ' + world.mouse.x.toString(),
        x: 10,
        y: 10,
        background: 'black'
    });
    Text({
        text: 'y: ' + world.mouse.y.toString(),
        x: 10,
        y: 30,
        background: 'black'
    });
    Text({
        text: `dx: ${dx} dy: ${dy}`,
        x: 10,
        y: 50,
        background: 'black'
    });
    mouseClicked && Text({
        text: 'MouseClicked',
        x: 10,
        y: 70,
        background: 'black'
    });
}

window.addEventListener('mousemove', () => {
    x.x = world.mouse.x - x.width / 2;
    y.y = world.mouse.y - y.height / 2;
    lastTouch = world.mouse;
});

const FPS = 360;

setInterval(main, 1000 / FPS);
