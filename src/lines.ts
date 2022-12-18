type CanvasPoint = {
    x: number,
    y: number
}

export type Line = {
    id: number,
    uid: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    deltaTimeInMilliseconds: number
};

export default class Lines {
    id: number = 0;
    uid: number = 0;
    lines: Array<any> = [];
    wasMousePressed: boolean = false;
    lastMousePoint: CanvasPoint = null;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    lastTimeInMilliseconds: number;
    update(isMousePressed: boolean, mousePoint: CanvasPoint) {
        if (isMousePressed === true) {
            if (this.lastMousePoint === null || this.lastMousePoint === undefined) {
                this.startX = mousePoint.x;
                this.startY = mousePoint.y;
                this.lastTimeInMilliseconds = performance.now();
            } else if (this.lastMousePoint.x !== mousePoint.x && this.lastMousePoint.y !== mousePoint.y) {
                this.endX = mousePoint.x;
                this.endY = mousePoint.y;
                const nowInMilliseconds = performance.now();
                const deltaTimeInMilliseconds = nowInMilliseconds - this.lastTimeInMilliseconds;
                this.lastTimeInMilliseconds = nowInMilliseconds;
                this.lines.push({ id: this.id, uid: this.uid, startX: this.startX, startY: this.startY, endX: this.endX, endY: this.endY, deltaTimeInMilliseconds });
                this.uid++;
                this.lastMousePoint = mousePoint;
                this.startX = mousePoint.x;
                this.startY = mousePoint.y;
            }
        } else {
            if (this.wasMousePressed === true && isMousePressed === false) {
                this.id++;
            }
        }
        this.wasMousePressed = isMousePressed;
        this.lastMousePoint = mousePoint;
    }
}