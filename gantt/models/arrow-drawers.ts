import {ArrowDrawer, ArrowRedrawer} from './arrow-drawer';
import {Point} from './point';

export const drawPolyline: ArrowDrawer = function (t1: Point, t2: Point, height: number): SVGPathElement {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let path = 'M ' + t1.x + ',' + t1.y + ' ';
    let x22 = t2.x - 5;
    if (x22 - t1.x < 5) {
        let x11 = t1.x + 5;
        let y22 = t2.y;
        if (t1.y <= t2.y) y22 -= height / 2 + 5;
        else y22 += height / 2 + 5;
        path += x11 + ',' + t1.y + ' ' + x11 + ',' + y22 + ' ' + x22 + ',' + y22;
    }
    else {
        path += (x22 - 5) + ',' + t1.y + ' Q ' + x22 + ',' + t1.y + ' ' + x22 + ',';
        if (t2.y > t1.y) path += (t1.y + 5);
        else path += (t1.y - 5);
        path += 'L';
    }
    if (t2.y > t1.y) path += ' ' + x22 + ',' + (t2.y - 5);
    else path += ' ' + x22 + ',' + (t2.y + 5);
    path += ' Q ' + x22 + ',' + t2.y + ' ' + t2.x + ',' + t2.y;
    elem.setAttribute('d', path);
    if (t2.x < t1.x) elem.setAttribute('stroke', 'red');
    else elem.setAttribute('stroke', 'black');
    elem.setAttribute('fill', 'none');
    return elem;
};

export const updatePolyline: ArrowRedrawer = function (elem: SVGPathElement, t1: Point, t2: Point, height: number): void {
    let path = 'M ' + t1.x + ',' + t1.y + ' ';
    let x22 = t2.x - 5;
    if (x22 - t1.x < 5) {
        let x11 = t1.x + 5;
        let y22 = t2.y;
        if (t1.y <= t2.y) y22 -= height / 2 + 5;
        else y22 += height / 2 + 5;
        path += x11 + ',' + t1.y + ' ' + x11 + ',' + y22 + ' ' + x22 + ',' + y22;
    }
    else path += x22 + ',' + t1.y;
    path += ' ' + x22 + ',' + t2.y + ' ' + t2.x + ',' + t2.y;
    elem.setAttribute('d', path);
};

export const drawPath: ArrowDrawer = function (t1: Point, t2: Point, height: number): SVGPathElement {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let path = 'M ' + t1.x + ',' + t1.y + ' C';
    if (t2.x - t1.x < 0) {
        let Ax = t1.x + 20;
        let Ay = t1.y;
        let Bx = t2.x - 20;
        let By = t2.y;
        let dy = 5; // marginVertical
        if (t1.y <= t2.y) {
            Ay += height / 2 + dy;
            By -= height / 2 + dy;
        }
        else {
            Ay -= height / 2 + dy;
            By += height / 2 + dy;
        }
        let dy1 = (By - Ay) * (Ax - t1.x) / (Ax - Bx);
        let Cy = Ay + dy1;
        let Dy = By - dy1;
        path += Ax + ',' + t1.y + ' ' + Ax + ',' + Ay + ' ' + t1.x + ',' + Cy;
        path += ' L' + t2.x + ',' + Dy;
        path += ' C' + Bx + ',' + By + ' ' + Bx + ',' + t2.y + ' ' + t2.x + ',' + t2.y;
    }
    else {
        let x22 = (t1.x + t2.x) / 2;
        path += x22 + ',' + t1.y;
        path += ' ' + x22 + ',' + t2.y + ' ' + t2.x + ',' + t2.y;
    }
    elem.setAttribute('d', path);
    if (t2.x < t1.x) elem.setAttribute('stroke', 'red');
    else elem.setAttribute('stroke', 'black');
    elem.setAttribute('fill', 'none');
    return elem;
};

export const updatePath: ArrowRedrawer = function (elem: SVGPathElement, t1: Point, t2: Point, height: number): void {
    let path = 'M ' + t1.x + ',' + t1.y + ' C';
    if (t2.x - t1.x < 0) {
        let Ax = t1.x + 20;
        let Ay = t1.y;
        let Bx = t2.x - 20;
        let By = t2.y;
        let dy = 5; // marginVertical
        if (t1.y <= t2.y) {
            Ay += height / 2 + dy;
            By -= height / 2 + dy;
        }
        else {
            Ay -= height / 2 + dy;
            By += height / 2 + dy;
        }
        let dy1 = (By - Ay) * (Ax - t1.x) / (Ax - Bx);
        let Cy = Ay + dy1;
        let Dy = By - dy1;
        path += Ax + ',' + t1.y + ' ' + Ax + ',' + Ay + ' ' + t1.x + ',' + Cy;
        path += ' L' + t2.x + ',' + Dy;
        path += ' C' + Bx + ',' + By + ' ' + Bx + ',' + t2.y + ' ' + t2.x + ',' + t2.y;
    }
    else {
        let x22 = (t1.x + t2.x) / 2;
        path += x22 + ',' + t1.y;
        path += ' ' + x22 + ',' + t2.y + ' ' + t2.x + ',' + t2.y;
    }
    elem.setAttribute('d', path);
};