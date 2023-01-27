export interface CustomWidgetSettingsRenderInterface {
    htmlComponent?: HTMLElement
    callbackEvent?: {
        subscribe: (data: any) => void
    }
}
