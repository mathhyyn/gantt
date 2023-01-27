import {GanttWidget} from './gantt/gantt';
import {aggregationLevels} from './gantt-timeline/date-aggregation-levels';

const intervalStart = new Date();
const intervalEnd = Date.now() + 1000 * 24 * 60 * 60;

const gantt = new GanttWidget({
    id: 'gantt-uniq-id',
    table: {
        columns: []
    },
    timeline: {
        rowCount: 2,
        aggregationLevels: [aggregationLevels.get('day'), aggregationLevels.get('week'), aggregationLevels.get('month')],
        width: 1050,
        minCellWidth: 90/*,
        dayAgreggationLevelRenderer: (date) => {
            let cell = document.createElement('div');
                cell.classList.add('gantt-timeline-cell');
                cell.style.backgroundColor = 'rgba(245, 222, 179, 0.7)';
            if (date.getUTCDate() == new Date().getDate() && date.getUTCMonth() == new Date().getMonth() && date.getUTCFullYear() == new Date().getFullYear())
                cell.id = 'today';
            else 
                cell.textContent = date.toLocaleDateString('ru', {timeZone: 'UTC'});
            return cell;
        }*/
    }
});

gantt.render(document.querySelector('body'));

