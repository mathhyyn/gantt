import {AggregationLevel} from './aggregation-level';

/**
 * navigation timeline
 */
export interface GanttTimelineOptions {
    /** A count of aggregation rows to be displayed */
    rowCount: number;
    /** Available zoom levels,
     * pass custom AggregationLevel object or a key for default level */
    aggregationLevels: (AggregationLevel /*| string*/)[],
    /** Min width of a tick **/
    minCellWidth?: number;
    width?: number;
    initialDensity?: number;
    initialStartTime?: number;
    initialAggregationLevel?: number;
    /** fixed levels which do not change after maxWidth reaching */
    fixedAggregationLevels?: (AggregationLevel | string)[],
    dayAgreggationLevelRenderer?: (date: Date) => HTMLElement,
}
