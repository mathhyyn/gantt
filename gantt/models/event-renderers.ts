import {Event} from './event';
import {CellRenderer} from './gantt-event-renderer';

export const simpleEvent: CellRenderer = function(task: any): HTMLElement { /* поменять any */
    const elem = document.createElement('div');
    elem.classList.add('gantt-diagram-event');
    elem.textContent = task.title;
    elem.style.backgroundColor = task.completed ? 'rgb(117, 184, 124)' : 'burlywood';
    let start = new Date(task.date);
    let finish = new Date(task.deadline);
    elem.title = 'start: ' + start.toUTCString() + '\n' + 'finish: ' + finish.toUTCString();
    return elem;
};