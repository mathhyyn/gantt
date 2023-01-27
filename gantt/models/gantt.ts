export interface Gantt<T = any, K = string> {
    /**
     * Inserts a new object.
     */
    insertObject(data: T): void;
    /**
     * Deletes an object.
     */
    deleteObject(key: K): void;
    /**
     * Updates the object data.
     */
    updateObject(key: K, data: T): void;
    /**
     * Inserts a new dependency.
     */
    insertDependency(data: any): void;
    /**
     * Deletes a dependency.
     */
    deleteDependency(key: any): void;
    /**
     * Inserts a new resource.
     */
    insertResource(data: any, objectKeys?: Array<any>): void;
    /**
     * Deletes a resource.
     */
    deleteResource(key: any): void;
    /**
     * Gets resources assigned to a task.
     */
    getTaskResources(key: any): Array<any>;
    /**
     * Gets the keys of the visible tasks.
     */
    getVisibleTaskKeys(): Array<any>;
    /**
     * Gets the keys of the visible dependencies.
     */
    getVisibleDependencyKeys(): Array<any>;
    /**
     * Gets the keys of the visible resources.
     */
    getVisibleResourceKeys(): Array<any>;
    /**
     * Gets the keys of the visible resource assignments.
     */
    getVisibleResourceAssignmentKeys(): Array<any>;
    /**
     * Updates the dimensions of the UI component contents.
     */
    updateDimensions(): void;
    /**
     * Scrolls the Gantt chart to the specified date.
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * Invokes the &apos;Resource Manager&apos; dialog.
     */
    showResourceManagerDialog(): void;
    /**
     * Expands all tasks.
     */
    expandAll(): void;
    /**
     * Collapses all tasks.
     */
    collapseAll(): void;
    /**
     * Expands all tasks down to the specified hierarchical level.
     */
    expandAllToLevel(level: Number): void;
    /**
     * Expands a task&apos;s parent tasks.
     */
    expandToTask(key: any): void;
    /**
     * Collapses a task.
     */
    collapseTask(key: any): void;
    /**
     * Expands a task.
     */
    expandTask(key: any): void;
    /**
     * Reloads data and repaints the Gantt component.
     */
    refresh(): Promise<void>;
    /**
     * Shows or hides task resources.
     */
    showResources(value: boolean): void;
    /**
     * Shows or hides dependencies between tasks.
     */
    showDependencies(value: boolean): void;
    /**
     * Zooms to fit the content
     */
    fit(): void;
    /**
     * Zooms in the Gantt chart.
     */
    zoomIn(): void;
    /**
     * Zooms out the Gantt chart.
     */
    zoomOut(): void;
}
