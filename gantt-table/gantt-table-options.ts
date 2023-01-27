import {Property} from '../gantt/models/property';
import {Row} from '../gantt/models/row';

export interface GanttTableOptions {
    /** for hierarchy */
    parentSystemName?: string;
    /** show the separate group for objects which do not have a parent object */
    showEmptyGroup?: boolean;
    leftPanelWidth?: number;
    columns: {
        property: Property,
        order?: number,
        width?: number,
        render?: (row: Row) => HTMLElement | string
    }[];
}
