import {Interval} from './interval';
import {AggregationLevel} from './aggregation-level';


/** example */
const dayAggregationLevel: AggregationLevel = {
    id: 'day',
    label: 'Days',
    ms: 1000 * 60 * 60 * 24,
    maxDensity: 1000 * 60 * 60 * 24 / 100,
    minDensity: 1000 * 60 * 60 * 24 / 500,

    renderer: (date) => {
        let cell = document.createElement('div');
        cell.classList.add('gantt-timeline-cell');
        cell.textContent = dayAggregationLevel.toDateString(date);
        return cell;
    },

    // формат вывода 01/01 + учитывается часовой пояс
    toDateString: (date) => {
        return date.toLocaleDateString('en-GB', {month: 'numeric', day: 'numeric'});
    },
    // изменить дату на i значений (прибавить i дней к текущей) 
    setDate(date, i) {
        date.setDate(date.getDate() + i);
    },

    getWidth: (_date, p) => {
        return dayAggregationLevel.ms / p;
    },
    getMinCellWidth: (p) => {
        return dayAggregationLevel.ms / p;
    },
    getMaxCellWidth: (p) => {
        return dayAggregationLevel.ms / p;
    },

    getStartTime: (time) => {
        let mod = (time - new Date().getTimezoneOffset() * 60 * 1000) % dayAggregationLevel.ms;
        return time - mod;
    },

    getSubIntervals: (from, to) => {
        const a = new Date(from).getDate();
        const b = new Date(to).getDate(); //to мб < from
        let res: Interval[] = [];
        for (let i = a; i < b; i++) {
            res.push({
                from: i,
                to: i + 1,
                meta: {
                    label: i.toString()
                }
            });
        }
        return res;
    }
};

const weekAggregationLevel: AggregationLevel = {
    id: 'week',
    label: 'Weeks',
    ms: 1000 * 60 * 60 * 24 * 7,
    maxDensity: 1000 * 60 * 60 * 24 * 7 / 100,
    minDensity: 1000 * 60 * 60 * 24 * 7 / 800,

    renderer: (date) => {
        let cell = document.createElement('div');
        cell.classList.add('gantt-timeline-cell');
        cell.textContent = weekAggregationLevel.toDateString(date);
        return cell;
    },

    toDateString: (date) => {
        let day = date.getDate();
        let weekDay = date.getDay();
        if (weekDay == 0) weekDay = 7; // вс - 0 день
        weekDay--;
        let monday = day - weekDay;
        let start = new Date(date);
        start.setDate(monday);
        let finish = new Date(date);
        finish.setDate(monday + 6);
        return start.toLocaleDateString('en-GB', {month: 'numeric', day: 'numeric'}) + ' - ' + finish.toLocaleDateString('en-GB', {month: 'numeric', day: 'numeric'});
    },
    setDate(date, i) {
        date.setDate(date.getDate() + 7 * i);
    },

    getWidth: (_date, p) => {
        return weekAggregationLevel.ms / p;
    },
    getMinCellWidth: (p) => {
        return weekAggregationLevel.ms / p;
    },
    getMaxCellWidth: (p) => {
        return weekAggregationLevel.ms / p;
    },

    getStartTime: (time) => {
        let mod = (time - 4 * dayAggregationLevel.ms - new Date().getTimezoneOffset() * 60 * 1000) % weekAggregationLevel.ms; 
        // 1.01.1970 - четверг
        // + учитывается часовой пояс
        return time - mod;
    }
};

const monthAggregationLevel: AggregationLevel = {
    id: 'month',
    label: 'Months',
    ms: 1000 * 60 * 60 * 24 * 31,
    maxDensity: 1000 * 60 * 60 * 24 * 30 / 100,
    minDensity: 1000 * 60 * 60 * 24 * 30 / 700,

    renderer: (date) => {
        let cell = document.createElement('div');
        cell.classList.add('gantt-timeline-cell');
        cell.textContent = monthAggregationLevel.toDateString(date);
        return cell;
    },

    toDateString: (date) => {
        return date.toLocaleDateString('en-US', {month: 'long'});
    },
    setDate(date, i) {
        date.setMonth(date.getMonth() + i);
    },

    getWidth: (date, p) => {
        let year = date.getFullYear();
        let month = date.getMonth();
        return (new Date(year, month + 1, 0).getDate() + 1) * dayAggregationLevel.ms / p;
    },
    getMinCellWidth: (p) => {
        return 28 * dayAggregationLevel.ms / p;
    },
    getMaxCellWidth: (p) => {
        return 31 * dayAggregationLevel.ms / p;
    },

    getStartTime: (time) => {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth();
        let firstDay = new Date(year, month, 1);
        return firstDay.getTime();
    }
};


export const aggregationLevels = new Map<(AggregationLevel | string), AggregationLevel>([
    ['day', dayAggregationLevel],
    ['week', weekAggregationLevel],
    ['month', monthAggregationLevel]
]);