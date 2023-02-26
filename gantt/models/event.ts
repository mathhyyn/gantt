import {Arrow} from './arrow';
export interface Event {
    id: string;
    cell?: HTMLDivElement;
    date: string;
    deadline: string;
    completed: boolean;
    startDependencies: Arrow[];
    endDependencies: Arrow[];
    x1: number;
    x2: number;
    y: number;
    leftMargin: number;
    rightMargin: number;
}