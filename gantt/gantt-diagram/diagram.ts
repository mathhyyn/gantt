import {dependencies} from './../../mocks/dependencies';
import {drawPositionedArrows} from './../models/arrows-positioning';
import {eventsSource, dependenciesSource} from './../../mocks/test';
import {simpleEvent} from '../models/event-renderers';
import {drawPath, drawPolyline, updatePath, updatePolyline} from '../models/arrow-drawers';
import {Event} from '../models/event';
import {Arrow} from '../models/arrow';
import {Point} from '../models/point';
import {GanttTimeline} from '../../gantt-timeline/gantt-timeline';
import {WidgetRenderer} from '../../widgets/models/widget-renderer';

export class GanttDiagram implements WidgetRenderer {
    visibleEvents: Map<string, Event> = new Map<string, Event>;
    visibleArrows: Map<string, Arrow> = new Map<string, Arrow>;
    // пока вместо них:
    events: Event[];
    arrows: Arrow[];
    timeline: GanttTimeline;
    diagram: HTMLElement;
    eventsContainer: HTMLElement;
    parentNode: HTMLElement;
    svg: SVGSVGElement;
    x: number;

    constructor(timeline: GanttTimeline) {
        this.x = 0;
        this.timeline = timeline;
    }

    render(parentNode: HTMLElement) {
        this.parentNode = parentNode;
        const diagram = document.createElement('div');
        diagram.classList.add('gantt-diagram');

        const elem = document.createElement('div');
        elem.classList.add('gantt-events');
        diagram.appendChild(elem);
        this.diagram = diagram;
        this.eventsContainer = elem;
        parentNode.appendChild(diagram);
        window.requestAnimationFrame(() => this.drawEvents());
        return diagram;
    }
    private drawEvents_(events) {
        this.events = events;
        this.events.forEach(task => {
            let start = new Date(task.date);
            let finish = new Date(task.deadline);
            let cell = this.drawEvent(start, finish);
            let event = simpleEvent(task);
            cell.appendChild(event);
            this.eventsContainer.appendChild(cell);
            this.visibleEvents[task.id] = {id: task.id, cell: cell, date: task.date, deadline: task.deadline, startDependencies: [], endDependencies: []};
        });

        this.createSVG();
        this.drawArrows();
    }
    private drawEvents() {
        eventsSource.getAll().then((events) => this.drawEvents_(events));
    }
    private drawEvent(t1: Date, t2: Date) {
        let x1 = this.timeline.getCoordByTime(t1);
        let x2 = this.timeline.getCoordByTime(t2);
        let width = x2 - x1;
        const elem = document.createElement('div');
        elem.classList.add('gantt-event-box');
        elem.style.width = width + 'px';
        elem.style.transform = 'translate(' + x1 + 'px, 0px)';
        return elem;
    }
    private getTransformTranslateX(elem: HTMLElement) {
        let style = window.getComputedStyle(elem);
        let matrix = style.transform;
        let matrixValues = matrix.match(/matrix\((.*)\)/)[1].split(', ');
        return +matrixValues[4];
    }
    private drawArrows_(dependencies) {
        this.arrows = dependencies;
        let h = 30;
        this.arrows.forEach(arrow => {
            let start = this.visibleEvents[arrow.predecessor];
            let finish = this.visibleEvents[arrow.successor];
            h = finish.cell.clientHeight;
            let elem;
            if (start && finish) {
                let x1 = this.getTransformTranslateX(start.cell) + start.cell.clientWidth;
                let y1 = start.cell.offsetTop;
                let x2 = this.getTransformTranslateX(finish.cell);
                let y2 = finish.cell.offsetTop;
                //elem = drawPolyline({x: x1, y: y1}, {x: x2, y: y2}, finish.cell.clientHeight);
                //this.svg.appendChild(elem);
                this.visibleArrows[arrow.id] = {id: arrow.id, cell: elem, predecessor: arrow.predecessor, successor: arrow.successor, t1: {x: x1, y: y1}, t2: {x: x2, y: y2},};
                // TODO:
                this.visibleEvents[arrow.successor].x1 = x2 - 10;
                this.visibleEvents[arrow.predecessor].x2 = x1 + 10;
                this.visibleEvents[arrow.successor].y = y2;
                this.visibleEvents[arrow.predecessor].y = y1;
            }
        });
        let aa = {};
        for (let bb in this.visibleArrows)
            aa[bb] = this.visibleArrows[bb];
        let elems = drawPositionedArrows(aa, this.visibleEvents, h);
        for (let elem of elems) {
            //console.log(elem);
            this.svg.appendChild(elem);
        }
    }
    private drawArrows() {
        dependenciesSource.getAll().then((dependencies) => this.drawArrows_(dependencies));
    }
    private createSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('gantt-svg');
        this.diagram.appendChild(svg);
        this.svg = svg;
    }

    shift(dx: number) {
        this.x -= dx;
        this.diagram.style.transform = 'translate(' + this.x + 'px, 0px)';
    }
    updateDiagram() {
        // обнуление сдвига
        this.x = 0;
        this.diagram.style.transform = 'translate(0px, 0px)';

        this.events.forEach(task => {
            let start = new Date(task.date);
            let finish = new Date(task.deadline);
            let x1 = this.timeline.getCoordByTime(start);
            let x2 = this.timeline.getCoordByTime(finish);
            let width = x2 - x1;
            this.visibleEvents[task.id].cell.style.width = width + 'px';
            this.visibleEvents[task.id].cell.style.transform = 'translate(' + x1 + 'px, 0px)';
        });
        this.arrows.forEach(arrow => {
            let start = this.visibleEvents[arrow.predecessor];
            let finish = this.visibleEvents[arrow.successor];
            let x1 = this.getTransformTranslateX(start.cell) + start.cell.clientWidth;
            let y1 = start.cell.offsetTop + start.cell.clientHeight / 2;
            let x2 = this.getTransformTranslateX(finish.cell);
            let y2 = finish.cell.offsetTop + finish.cell.clientHeight / 2;
            updatePolyline(this.visibleArrows[arrow.id].cell, {x: x1, y: y1}, {x: x2, y: y2}, finish.cell.clientHeight);
        });
    }
}