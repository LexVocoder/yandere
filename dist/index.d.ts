interface IError {
    message: string;
    name: string;
    stack?: string;
}
/**
 * asError casts any value to an Error-like object.  It is VERY unlikely to throw exceptions.
 */
export declare function asError(val: any): IError;
/**
 * YError is an enhanced Error class that has a cause field.
 */
export declare class YError extends Error {
    private cause?;
    /**
     * YError constructor uses `message` as a prefix if `cause` is defined.
     *
     * @param message  (the prefix of) the message for this error
     * @param cause  the error that caused _this_ error -- yes, this can be _any_ type
     *
     * If cause is defined, this error's message property becomes `message`, followed by a colon (:), followed by
     * either cause's message or some printable version of it.  This tries very hard to make sure
     * the message is readable and thorough.
     *
     * Similarly, if cause is defined, it is appended to this error's stack property, along with some decoration for readability.
     */
    constructor(message: string, cause?: any);
}
export {};
