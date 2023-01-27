import {Event} from './event';
import {Row} from './row';

export type CellRenderer<T = any> = (Task: any) => HTMLElement;