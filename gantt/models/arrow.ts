import {Point} from './point';
export interface Arrow {
    id: string;
    cell?: SVGPathElement;
    predecessor: string;
    successor: string;
    orderAtSuccessor: number;
    orderAtPredecessor: number;
    t1: Point;
    t2: Point;
    intersections:  Intersection[];
}

export interface Intersection {
    x: number;
    y: number;
    position: boolean;
}