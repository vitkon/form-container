export type ComponentInstance<P = any, S = any> = new () => React.Component<P, S>


type Validator<T> = (model: Partial<T>) => boolean
type ErrorMessage<T> = {
    [name: string]: string | undefined
}

export type ValidationRule = <T>(prop: keyof T, errorMessage?: string, attr?: any) => [
    Validator<T>,
    ErrorMessage<typeof prop>
];