import { CanvasPoint } from "./canvas";

/**
 * if lines are parallel then return null
 * otherwise return {x,y}
 */
export function intersect(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): CanvasPoint | null {
    const A1: number = by - ay;
    const B1: number = bx - ax;
    const C1: number = A1 * bx - B1 * by;
    const A2: number = dy - cy;
    const B2: number = dx - cx;
    const C2: number = A2 * dx - B2 * dy;
    const determinant: number = A1 * B2 - A2 * B1;

    if (determinant === 0) {
        return null;
    }

    const x: number = (B2 * C1 - B1 * C2) / determinant;
    const y: number = (A1 * C2 - A2 * C1) / determinant;

    const xAbs: number = Math.abs(x);
    const yAbs: number = Math.abs(y);

    const abxMin: number = Math.min(ax, bx);
    const abxMax: number = Math.max(ax, bx);
    const cdxMin: number = Math.min(cx, dx);
    const cdxMax: number = Math.max(cx, dx);

    const abyMin: number = Math.min(ay, by);
    const abyMax: number = Math.max(ay, by);
    const cdyMin: number = Math.min(cy, dy);
    const cdyMax: number = Math.max(cy, dy);

    const isPointBetweenGivenLines: boolean =
        abxMin < xAbs &&
        abxMax > xAbs &&
        cdxMin < xAbs &&
        cdxMax > xAbs &&
        abyMin < yAbs &&
        abyMax > yAbs &&
        cdyMin < yAbs &&
        cdyMax > yAbs;

    if (!isPointBetweenGivenLines) {
        return null;
    }

    return { x: xAbs, y: yAbs };
}