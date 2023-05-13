/**
 * An error which can be thrown when a value does not fall within a list of possibilities which are assumed to be exhaustive.
 * As it is constructed with that value as a parameter whose type is 'never', this can help us to detect unhandled cases.
 */
 export class UnexpectedValueError extends Error {
    /**
     * An error which can be thrown when a value does not fall within a list of possibilities which are assumed to be exhaustive.
     *
     * @param value This is the value which would have to have an unexpected value for the constructor to be executed.
     * As the parameter's type is 'never', this can help us to detect unhandled cases.
     */
    constructor(value: never) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        super(`Unhandled argument '${value}'`);
    }
}
