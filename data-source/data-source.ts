export interface DataSource {
    getAll(): Promise<any>; //Promise<void>
}