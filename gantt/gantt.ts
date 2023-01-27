import {GanttDiagram} from './gantt-diagram/diagram';
import {WidgetRenderer} from '../widgets/models/widget-renderer';
import {GanttOptions} from './models/gantt-options';
import {GanttTimeline} from '../gantt-timeline/gantt-timeline';
import {defu} from 'defu';

const LEFT_MOUSE_BUTTON = 0;
export class GanttWidget<T = any, K = string> implements WidgetRenderer {
    diagram: GanttDiagram;
    x0: number;
    op: GanttOptions<T, K>;

    constructor(private options: GanttOptions<T, K>) {
        let defaults = {
            id: 'gantt-uniq-id',
            table: {},
            timeline: {}
        };
        this.op = defu(options, defaults);
    }

    render(parentNode: HTMLElement) {
        /** replace with your code here */
        const timelineAndDiagram = document.createElement('div');
        timelineAndDiagram.classList.add('gantt-container');
        parentNode.appendChild(timelineAndDiagram);

        const timelineContainer = document.createElement('div');
        timelineContainer.classList.add('gantt-timeline-box');
        timelineAndDiagram.appendChild(timelineContainer);
        const timeline = new GanttTimeline(this.op.timeline);
        /** todo add table, canvas renderer */
        timelineContainer.appendChild(timeline.render(timelineContainer));

        const diagramContainer = document.createElement('div');
        diagramContainer.classList.add('gantt-diagram-box');
        timelineAndDiagram.appendChild(diagramContainer);
        diagramContainer.style.width = this.op.timeline.width + 'px';

        const diagram = new GanttDiagram(timeline);
        this.diagram = diagram;
        diagram.render(diagramContainer);

        this.x0 = timelineAndDiagram.getBoundingClientRect().x;
        timelineAndDiagram.onwheel = (e) => {
            // сдвиг (прокрутка с помощью тачпада вправо-влево)
            if (e.deltaX != 0) {
                window.requestAnimationFrame(() => {
                    timeline.shift(e.deltaX * 3);
                    diagram.shift(e.deltaX * 3);
                });
            }
            // мастштабирование
            if (e.ctrlKey && e.deltaY != 0) {
                e.preventDefault(); // убирает масштабирование страницы по умолчанию
                window.requestAnimationFrame(() => {
                    timeline.scale(e.deltaY / 10, e.pageX - this.x0);
                    diagram.updateDiagram();
                });
            }
        };
        timelineAndDiagram.onmousedown = (e) => {
            if (e.button == LEFT_MOUSE_BUTTON) {
                document.onmousemove = (e) => {
                    window.requestAnimationFrame(() => {
                        timeline.shift(-e.movementX);
                        diagram.shift(-e.movementX);
                    });
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                };
            }
        };
        return timelineAndDiagram;
    }

    /** pass events data */
    init(load: Promise<T[]>): Promise<void> {
        /** replace with your code here */
        return Promise.reject();
    }
}
