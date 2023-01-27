import {Row} from './row';

export type CellRenderer<T = any> = (row: Row) => HTMLElement;