import { dependencies } from './../../mocks/dependencies';
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
            if (a.t2.x - a.t1.x < 0 && b.t2.x - b.t1.x >= 0)
                if (a.t1.y < a.t2.y) return -1;
                else return 1;
            if (b.t2.x - b.t1.x < 0 && a.t2.x - a.t1.x >= 0)
                if (b.t1.y < b.t2.y) return 1;
                else return -1;
            return a.t1.y - b.t1.y;
        });
        events[ev].endDependencies.sort((a: Arrow, b: Arrow) => { return a.t2.y - b.t2.y; });
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
            ar.t2.y += j * height / (event.startDependencies.length + 1);
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
            ar.t1.y += j * height / (event.endDependencies.length + 1);
        }
    }
}

export const drawPositionedArrows = function (arrows: {}, events: Map<string, Event>, height?: number): SVGPathElement[] {
    assignDependenciesToEvents(arrows, events);
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
                path += (x22 - 5) + ',' + t1.y + ' Q ' + x22 + ',' + t1.y + ' ' + x22 + ',';
                path += (t1.y + cornerDirection);
            } else {
                let x11 = events[arrow.predecessor].x2 + arrow.orderAtPredecessor * 10;
                path += (x11 - 5) + ',' + t1.y + ' Q ' + x11 + ',' + t1.y + ' ' + x11 + ',';
                path += (t1.y + cornerDirection);
                path += ' L ' + x11 + ',';
                if (events[arrow.successor].y == events[arrow.predecessor].y) y22 += cornerDirection;
                else y22 -= cornerDirection;
                if (events[arrow.successor].y <= events[arrow.predecessor].y) y22 += height;
                path += (y22 - cornerDirection);
                path += ' Q ' + x11 + ',' + y22 + ' ' + (x11 - 5) + ',' + y22;
                path += ' L ' + (x22 + 5) + ',' + y22 + ' Q ' + x22 + ',' + y22 + ' ' + x22 + ',';
                if (events[arrow.successor].y == events[arrow.predecessor].y) cornerDirection = -5;
                path += (y22 + cornerDirection);
            }
            path += ' L ';
            path += x22 + ',' + (t2.y - cornerDirection);
            path += ' Q ' + x22 + ',' + t2.y + ' ' + (x22 + 5) + ',' + t2.y + ' L ' + t2.x + ',' + t2.y;
            elem.setAttribute('d', path);
            //if (t2.x < t1.x) elem.setAttribute('stroke', 'red'); else 
            elem.setAttribute('stroke', 'black');
            elem.setAttribute('fill', 'none');
            result.push(elem);
        }
    }
    return result;
};