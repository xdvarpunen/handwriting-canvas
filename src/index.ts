import * as PIXI from 'pixi.js'

import Lines from "./lines";
import { Recognition } from "./recognition";

const recognition = new Recognition();
const lines = new Lines();

const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

graphics.lineStyle(4, 0xffd900, 1);

app.stage.addChild(graphics);

let isDrawing = false;
let prevX = null;
let prevY = null;

function pointerMove(event) {
    if (isDrawing === true) {
        lines.update(isDrawing, {
            x: event.data.global.x, y: event.data.global.y
        });
        graphics.moveTo(prevX, prevY);
        graphics.lineTo(event.data.global.x, event.data.global.y);
        prevX = event.data.global.x;
        prevY = event.data.global.y;
    }
}

function pointerDown(event) {
    isDrawing = true;
    prevX = event.data.global.x;
    prevY = event.data.global.y;
    lines.update(isDrawing, {
        x: prevX, y: prevY
    });
}

function pointerUp(event) {
    isDrawing = false;
    prevX = null;
    prevY = null;
    lines.update(isDrawing, {
        x: null, y: null
    });
}

app.stage.interactive = true;
app.stage.hitArea = app.renderer.screen;

app.stage.on('pointerdown', pointerDown);
app.stage.on('pointerup', pointerUp);
app.stage.on('pointermove', pointerMove);

window.onload = function init() {
    document.getElementById("compute").addEventListener('click', function () {
        recognition.computeStroke(lines.lines);
    });
}