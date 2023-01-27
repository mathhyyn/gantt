import {CustomWidgetSettingsRenderInterface} from './custom-widget-settings-render.interface';

export interface WidgetRenderer {
    isResizable?(): boolean;
    isDraggable?(): boolean;
    /** can include other widgets as children */
    canHaveChildren?(): boolean;
    render(parentNode: HTMLElement, entity?: any): HTMLElement;
    update?(propId: string, value: string, customSettings?: any): void;
    /** returns {} by default */
    renderSettings?(): CustomWidgetSettingsRenderInterface;
    destroySettings?(): void;
    destroy?(): void;
}
