import {Row} from './row';
import {Point} from './point';

/* draw an arrow from point to point */
export type ArrowDrawer = (from: Point, to: Point, height: number) => HTMLElement | SVGPathElement;
export type ArrowRedrawer = (arrow: HTMLElement | SVGPathElement, from: Point, to: Point, height: number) => void;