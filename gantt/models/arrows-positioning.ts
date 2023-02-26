import { Arrow } from './arrow';
import { Event } from './event';

function assignDependenciesToEvents(arrows: {}, events: Map<string, Event>) {
    for (let ar in arrows) {
        let arrow = arrows[ar];
        events[arrow.successor].startDependencies.push(arrow);
        events[arrow.predecessor].endDependencies.push(arrow);
    };
}

function sortSuccessors(events: Map<string, Event>): Event[] {
    let result: Event[] = [];

    for (let ev in events) {
        let event = events[ev];
        if (event.startDependencies.length > 0)
            result.push(event);
    };
    result.sort((a: Event, b: Event) => { return a.x1 - b.x1; });
    //result.reverse();
    return result;
}

function sortPredecessors(events: Map<string, Event>): Event[] {
    let result: Event[] = [];

    for (let ev in events) {
        let event = events[ev];
        if (event.endDependencies.length > 0)
            result.push(event);
    };
    result.sort((a: Event, b: Event) => { return a.x2 - b.x2; });
    //result.reverse();
    return result;
}

function compareFunction(a: Arrow, b: Arrow): number {

    return a.t1.y - b.t1.y;
}

function sortDependencies(events: Map<string, Event>, height: number) {
    for (let ev in events) {
        events[ev].startDependencies.sort((a: Arrow, b: Arrow) => {
            // задача стрелки а "впереди" b "сзади"
            if (a.t2.x - a.t1.x < 0 && b.t2.x - b.t1.x >= 0)
                // successor ниже 
                if (a.t1.y < a.t2.y) return -1;
                else return 1;
            if (b.t2.x - b.t1.x < 0 && a.t2.x - a.t1.x >= 0)
                if (b.t1.y < b.t2.y) return 1;
                else return -1;
            return a.t1.y - b.t1.y;
        });
        events[ev].endDependencies.sort((a: Arrow, b: Arrow) => {
            if (a.t2.x < a.t1.x && b.t2.x < b.t1.x && a.t2.y >= a.t1.y && b.t2.y >= b.t1.y)
                return b.t2.y - a.t2.y;
            return a.t2.y - b.t2.y;
        });
    }
    for (let ev in events) {
        let event = events[ev];
        let i = 0;
        let j = 0;
        event.leftMargin = 0;
        let dependenciesIsFromBelow = false;
        for (let ar of event.startDependencies) {
            if (ar.t1.y >= ar.t2.y && !dependenciesIsFromBelow) {
                event.leftMargin = Math.max(i, event.startDependencies.length - i);
                i = event.startDependencies.length - i - 1;
                dependenciesIsFromBelow = true;
            }
            ar.orderAtSuccessor = i;
            if (ar.t1.y >= ar.t2.y) i--;
            else i++;

            j++;
            //ar.t2.y += j * height / (event.startDependencies.length + 1);
            ar.t2.y += height / 2
        }

        i = 0;
        j = 0;
        event.rightMargin = 0;
        dependenciesIsFromBelow = false;
        for (let ar of event.endDependencies) {
            if (ar.t2.y >= ar.t1.y && !dependenciesIsFromBelow) {
                event.rightMargin = Math.max(i, event.endDependencies.length - i);
                i = event.endDependencies.length - i - 1;
                dependenciesIsFromBelow = true;
            }
            ar.orderAtPredecessor = i;
            if (ar.t2.y >= ar.t1.y) i--;
            else i++;

            j++;
            //ar.t1.y += j * height / (event.endDependencies.length + 1);
            ar.t1.y += height / 2
        }
    }
}

let vert_points = {};
let hor_points = {};

export const drawPositionedArrows = function (arrows: {}, events: Map<string, Event>, height?: number, isFirst = false): SVGPathElement[] {
    if (isFirst) {
        assignDependenciesToEvents(arrows, events);
    }
    let successors = sortSuccessors(events);
    let predecessors = sortPredecessors(events);
    sortDependencies(events, height);
    for (let i = 1; i < successors.length; i++) {
        if (events[successors[i].id].x1 - events[successors[i - 1].id].x1 < 10) {
            events[successors[i].id].x1 = events[successors[i - 1].id].x1 - events[successors[i - 1].id].leftMargin * 10 - 5;
        }
    }
    for (let i = 1; i < predecessors.length; i++) {
        if (events[predecessors[i].id].x2 - events[predecessors[i - 1].id].x2 < 10) {
            events[predecessors[i].id].x2 = events[predecessors[i - 1].id].x2 - events[predecessors[i - 1].id].rightMargin * 10 - 5;
        }
    }



    let result: SVGPathElement[] = [];
    for (let ev in events) {
        let i = 0;
        for (let arrow of events[ev].startDependencies) {
            i++;
            let t1 = arrow.t1;
            let t2 = arrow.t2;
            const elem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            let path = 'M ' + t1.x + ',' + t1.y + ' ';
            let x22 = events[arrow.successor].x1 - arrow.orderAtSuccessor * 10;
            let y22 = events[arrow.successor].y;


            let cornerDirection = 5;
            if (events[arrow.successor].y < events[arrow.predecessor].y) cornerDirection = -5;

            if (t2.x - t1.x >= 20) {
                addHorizontalLine(t1.x, t1.y, x22 - 5, arrow);
                addVerticalLine(t1.y + cornerDirection, x22, t2.y - cornerDirection, arrow);
            } else {
                let x11 = events[arrow.predecessor].x2 + arrow.orderAtPredecessor * 10;
                addHorizontalLine(t1.x, t1.y, x11 - 5, arrow);
                if (events[arrow.successor].y == events[arrow.predecessor].y) y22 += cornerDirection;
                else y22 -= cornerDirection;
                if (events[arrow.successor].y <= events[arrow.predecessor].y) y22 += height;
                addVerticalLine(t1.y + cornerDirection, x11, y22 - cornerDirection, arrow);
                
                addHorizontalLine(x11 - 5, y22, x22 + 5, arrow);
                if (events[arrow.successor].y == events[arrow.predecessor].y) cornerDirection = -5;

                addVerticalLine(y22 + cornerDirection, x22, t2.y - cornerDirection, arrow);
            }
            addHorizontalLine(x22, t2.y, t2.x, arrow);

            findIntersections();

            // 2ой круг - отрисовка
            cornerDirection = 5;
            if (events[arrow.successor].y < events[arrow.predecessor].y) cornerDirection = -5;

            // доделать!!!
            if (t2.x - t1.x >= 20) {
                addHorizontalLine(t1.x, t1.y, x22 - 5, arrow);
                path += (x22 - 5) + ',' + t1.y + ' Q ' + x22 + ',' + t1.y + ' ' + x22 + ',';
                path += (t1.y + cornerDirection);
                addVerticalLine(t1.y + cornerDirection, x22, t2.y - cornerDirection, arrow);
            } else {
                let x11 = events[arrow.predecessor].x2 + arrow.orderAtPredecessor * 10;
                addHorizontalLine(t1.x, t1.y, x11 - 5, arrow);
                path += (x11 - 5) + ',' + t1.y + ' Q ' + x11 + ',' + t1.y + ' ' + x11 + ',';
                path += (t1.y + cornerDirection);
                path += ' L ' + x11 + ',';
                path += (y22 - cornerDirection);
                addVerticalLine(t1.y + cornerDirection, x11, y22 - cornerDirection, arrow);
                path += ' Q ' + x11 + ',' + y22 + ' ' + (x11 - 5) + ',' + y22;
                
                addHorizontalLine(x11 - 5, y22, x22 + 5, arrow);
                path += ' L ' + (x22 + 5) + ',' + y22 + ' Q ' + x22 + ',' + y22 + ' ' + x22 + ',';
                if (events[arrow.successor].y == events[arrow.predecessor].y) cornerDirection = -5;
                path += (y22 + cornerDirection);

                addVerticalLine(y22 + cornerDirection, x22, t2.y - cornerDirection, arrow);
            }
            
            path += ' L ';
            path += x22 + ',' + (t2.y - cornerDirection);
            path += ' Q ' + x22 + ',' + t2.y + ' ' + (x22 + 5) + ',' + t2.y + ' L ' + t2.x + ',' + t2.y;
            addHorizontalLine(x22, t2.y, t2.x, arrow);
            elem.setAttribute('d', path);
            //if (t2.x < t1.x) elem.setAttribute('stroke', 'red'); else 
            elem.setAttribute('stroke', 'black');
            elem.setAttribute('fill', 'none');
            arrow.cell = elem;
            //result.push(elem);
        }
    }
    return result;
};

export const cutArrows = function (arrows: {}, events: Map<string, Event>, height?: number): SVGPathElement[] {



    return [];
}

const addHorizontalLine = function (x01: number, y0: number, x02: number, ar: Arrow) {
    let x1 = Math.floor(x01);
    let y = Math.floor(y0);
    let x2 = Math.floor(x02);
    if (x2 >= x1)
        for (let i = x1; i <= x2; i++) {
            addHorizontalPoint(i, y, ar);
        }
    else for (let i = x2; i <= x1; i++) {
        addHorizontalPoint(i, y, ar);
    }
}

const addVerticalLine = function (y01: number, x0: number, y02: number, ar: Arrow, position: boolean = false) {
    let y1 = Math.floor(y01);
    let x = Math.floor(x0);
    let y2 = Math.floor(y02);
    if (y2 >= y1)
        for (let i = y1; i <= y2; i++) {
            addVerticalalPoint(x, i, ar, position);
        }
    else for (let i = y2; i <= y1; i++) {
        addVerticalalPoint(x, i, ar, position);
    }
}

const addHorizontalPoint = function (x: number, y: number, ar: Arrow) {
    /*let x = Math.floor(x0);
    let y = Math.floor(y0);*/
    let id = x + '+' + y;
    if (!hor_points[id]) hor_points[id] = [ar]
    else hor_points[id].push(ar);
}

const addVerticalalPoint = function (x: number, y: number, ar: Arrow, position: boolean) {
    /*let x = Math.floor(x0);
    let y = Math.floor(y0);*/
    let id = x + '+' + y;
    if (!vert_points[id]) vert_points[id] = [{arrow: ar, position: position, x: x, y: y}]
    else vert_points[id].push({arrow: ar, position: position});
}

const findIntersections = function () {
    for (let id in vert_points) {
        if (hor_points[id]) {
            let point = vert_points[id];
            //point.arrow.intersections.push({x: point.x, y: point.y, position: point.position});
        }

    }
    // position == true для второй вертикальной линии в стрелке
}