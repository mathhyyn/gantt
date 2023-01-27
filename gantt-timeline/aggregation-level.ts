import {Interval} from './interval';

/**
 * Zoom time aggregation level
 * This adds possibility to have custom time aggregations like `Sprint`
 */
export interface AggregationLevel {
    /** unique identifier */
    id: string,
    /** hover label **/
    label?: string,
    /* max number of milliseconds in one cell */
    ms: number,
    /* the limit of density at which we move to a higher level
       must be >= than minDensity of the higher level */
    maxDensity: number,
    /* the limit of density at which we move to the level below
       must be <= than maxDensity of the level below */
    minDensity: number,
    /** widget to visualize
     * should render some text content by default  */
    renderer: (date: Date) => HTMLElement,
    /**
     * receive interval to be sliced, returns subintervals
     * @param from
     * @param to
     */
    /* get the time period in string format */
    toDateString: (date: Date) => string,
    /* add to the date the value of i ( ~ moving to the nex cell (when i = 1)) */
    setDate(date: Date, i: number): void,
    /* get the time in the left border of the cell (00:00 for days) */
    getStartTime: (time: number) => number,
    // get width of current cell
    getWidth: (date: Date, density: number) => number,
    // it is necessary to get the number of cells
    getMinCellWidth: (density: number) => number,
    // it is necessary for virtual scrolling
    getMaxCellWidth: (density: number) => number,
    getSubIntervals?: (from: number, to: number) => Interval[]
}
