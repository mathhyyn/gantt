export enum ParamType {
    /** for __id only */
    pkey = 'pkey',
    string = 'str',
    boolean = 'bool',
    entityId = 'link',
    custom = 'custom',
    date = 'datetime',
    int = 'int',
    number = 'number',
    jsonObject = 'jsonobject',
    fileDocument = 'fileDocument',
    fileImage = 'fileImage',
    jsonArray = 'jsonarray',
    duration = 'duration',
    color = 'color',
    /** todo list or json array ? */
    list = 'list',
}