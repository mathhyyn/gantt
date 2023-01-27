import {ParamType} from './param-type';

/** Свойство объекта строки */
export interface Property {
    id: string;
    /** Текст для отображения в заголовке */
    displayName: string;
    /** Ключ по которому читать данные из объекта */
    systemName?: string;
    /** Тип поля */
    type: ParamType;
    /** used only for type=ParamType.entityId
     * linked entity id */
    entityId?: string;
    defaultValues?: Array<any>;
    enumValues?: any;
}
