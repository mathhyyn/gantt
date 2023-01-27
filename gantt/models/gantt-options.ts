
import {GanttTimelineOptions} from '../../gantt-timeline/gantt-timeline-options';
import {GanttTableOptions} from '../../gantt-table/gantt-table-options';

/**
 * T - object class
 * K - object key class
 */
export interface GanttOptions<T = any, K = string> {
    id: string;
    timeline?: GanttTimelineOptions;
    table?: GanttTableOptions;
    /** todo add other widget options */
}
