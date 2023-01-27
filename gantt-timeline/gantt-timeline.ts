import {AggregationLevel} from './aggregation-level';
import {aggregationLevels} from './date-aggregation-levels';
import {WidgetRenderer} from '../widgets/models/widget-renderer';
import {GanttTimelineOptions} from './gantt-timeline-options';
import {defu} from 'defu';

export class GanttTimeline implements WidgetRenderer {
    op: GanttTimelineOptions;
    n: number;
    density: number;
    curMaxCellWidth: number; // текущая максимальная ширина ячейки, т.е. для месяцев соответствует 31 дню
    startTime: number;
    timeline: HTMLElement;
    x: number;
    x0: number;
    currentLevel: number;
    aggregationLevel: AggregationLevel;

    constructor(private options: GanttTimelineOptions) {
        let defaults = {
            rowCount: 2,
            width: 1050,
            initialDensity: 1000 * 60 * 60 * 24 / 150,
            initialStartTime: new Date().getTime(),
            initialAggregationLevel: 0
        };
        this.op = defu(options, defaults);
        // массивы конкатенируются
        if (options.aggregationLevels) this.op.aggregationLevels = options.aggregationLevels;
        else this.op.aggregationLevels = [aggregationLevels.get('day'), aggregationLevels.get('week'), aggregationLevels.get('month')];
        this.x = 0;
        this.density = this.op.initialDensity;
        this.currentLevel = this.op.initialAggregationLevel;
        this.aggregationLevel = this.op.aggregationLevels[this.currentLevel];
        this.curMaxCellWidth = this.aggregationLevel.getMaxCellWidth(this.density);
    }

    render(parentNode: HTMLElement) {
        /** replace with your code here */
        parentNode.style.width = this.op.width + 'px';
        const elem = document.createElement('div');
        elem.classList.add('gantt-timeline');
        this.timeline = elem;
        this.x = - this.getStartCoord(this.op.initialStartTime);
        this.timeline.style.transform = 'translate(' + this.x + 'px, 0px)';
        this.drawColumns();
        return elem;
    }
    private drawColumns() {
        let curMinCellWidth = this.aggregationLevel.getMinCellWidth(this.density);
        // текущая минимальная ширина ячейки, т.е. для месяцев соответствует 28 дням
        this.n = Math.ceil(this.op.width / curMinCellWidth) + 1;
        //let subIntervals = dayAggregationLevel.getSubIntervals(currentTime, currentTime + 1000 * 24 * 60 * 60 * this.n);
        this.timeline.innerHTML = '';
        for (let i = 0; i < this.n; i++) {
            let cell = document.createElement('div');
            cell.classList.add('timeline-cell-box');
            this.timeline.appendChild(cell);
            let d = new Date(this.startTime);
            this.aggregationLevel.setDate(d, i);
            cell.style.width = this.aggregationLevel.getWidth(d, this.density) + 'px';
            let content = this.aggregationLevel.renderer(d);
            cell.appendChild(content);
        }
    }
    private addCellToStart() {
        let firstCell = document.createElement('div');
        firstCell.classList.add('timeline-cell-box');
        let d = new Date(this.startTime);
        firstCell.style.width = this.aggregationLevel.getWidth(d, this.density) + 'px';
        this.timeline.prepend(firstCell);
        let content = this.aggregationLevel.renderer(d);
        firstCell.appendChild(content);
        this.timeline.lastElementChild.remove();
    }
    private addCellToEnd() {
        let lastCell = document.createElement('div');
        lastCell.classList.add('timeline-cell-box');
        let d = new Date(this.startTime);
        lastCell.style.width = this.aggregationLevel.getWidth(d, this.density) + 'px';
        this.timeline.appendChild(lastCell);
        this.aggregationLevel.setDate(d, this.n - 1);
        let content = this.aggregationLevel.renderer(d);
        lastCell.appendChild(content);
    }
    shift(dx: number) {
        this.x -= dx;

        while (this.x > 0) {
            let d = new Date(this.startTime);
            this.aggregationLevel.setDate(d, -1);
            this.startTime = d.getTime();
            this.x -= this.aggregationLevel.getWidth(d, this.density);
            this.addCellToStart();
        }
        while (this.x < -this.curMaxCellWidth) {
            let d = new Date(this.startTime);
            this.aggregationLevel.setDate(d, 1);
            this.startTime = d.getTime();
            this.x += this.aggregationLevel.getWidth(d, this.density);
            this.addCellToEnd();
            this.timeline.firstElementChild.remove();
        }

        this.timeline.style.transform = 'translate(' + this.x + 'px, 0px)';
    }
    private updateWidth() {

        let curMinCellWidth = this.aggregationLevel.getMinCellWidth(this.density);
        let new_n = Math.ceil(this.op.width / curMinCellWidth) + 1;
        while (new_n < this.n) {
            this.n--;
            this.timeline.lastElementChild.remove();
        }
        while (new_n > this.n) {
            this.n++;
            this.addCellToEnd();
        }
        
        let columns = this.timeline.querySelectorAll<HTMLElement>('.timeline-cell-box');
        for (let i = 0; i < this.n; i++) {
            let d = new Date(this.startTime);
            this.aggregationLevel.setDate(d, i);
            columns[i].style.width = this.aggregationLevel.getWidth(d, this.density) + 'px';
        }
    }
    scale(dy: number, x: number) {
        let isLevelChanged = false;
        let p = this.density;
        if (dy > 0) p *= 1.05;
        if (dy < 0) p *= 0.95;

        if (p > this.aggregationLevel.maxDensity) {
            p = this.aggregationLevel.maxDensity;
            if (this.currentLevel < this.op.aggregationLevels.length - 1) {
                this.aggregationLevel = this.op.aggregationLevels[++this.currentLevel];
                isLevelChanged = true;
            }
        }
        if (p < this.aggregationLevel.minDensity) {
            p = this.aggregationLevel.minDensity;
            if (this.currentLevel > 0) {
                this.aggregationLevel = this.op.aggregationLevels[--this.currentLevel];
                // this.minDensity = p;
                isLevelChanged = true;
            }
        }

        let dp = this.density / p;
        this.density = p;
        this.curMaxCellWidth = this.aggregationLevel.getMaxCellWidth(this.density);

        let dx = x - this.x;
        let dx_scale = dx * dp;
        this.shift(dx_scale - dx);


        this.updateWidth();

        if (isLevelChanged) {
            let curTime = this.getTimeByCoord(-this.x);
            this.x = - this.getStartCoord(curTime);
            this.timeline.style.transform = 'translate(' + this.x + 'px, 0px)';

            let columns = this.timeline.querySelectorAll<HTMLElement>('.timeline-cell-box');
            for (let i = 0; i < this.n; i++) {
                columns[i].innerHTML = '';
                let d = new Date(this.startTime);
                this.aggregationLevel.setDate(d, i);
                let content = this.aggregationLevel.renderer(d);
                columns[i].appendChild(content);
            }
            //this.shift(0);
        }
    }

    /* get the cell offset relative to a given time */
    private getStartCoord(time: number) : number {
        this.startTime = this.aggregationLevel.getStartTime(time);
        let dt = time - this.startTime;
        return dt / this.density;
    }

    /* get time by coordinate, counting from the left border of the timeline */
    private getTimeByCoord(x: number) : number {
        return this.startTime + x * this.density;
    }

    getCoordByTime(date: Date) {
        let time = date.getTime();
        // time += new Date().getTimezoneOffset() * 60 * 1000;
        return (time - this.startTime + this.x * this.density) / this.density;
    }
}