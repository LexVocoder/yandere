// Yandere - error utilities for yonder error

interface IError {
    message: string;
    name: string;
    stack?: string;
}

/**
 * asError casts any value to an Error-like object.  It is VERY unlikely to throw exceptions.
 */
export function asError(val: any): IError {
    var res: IError;

    if (val instanceof Error) {
        res = val;
    }
    else if (!defined(val)) {
        res = {
            message: 'undefined',
            name: '',
            stack: 'undefined',
        };
    } else if (val === null) {
        res = {
            message: 'null',
            name: 'object',
            stack: 'object: null',
        };
    } else if (val === "") {
        res = {
            message: '(empty string)',
            name: 'string',
            stack: '(empty string)',
        };
    } else if (typeof(val) === 'string') {
        res = {
            message: val,
            name: typeof(val),
            stack: val,
        };
    } else {
        const message = coalesceToPrintable(val['message'], toPrintable(val));
        const name = coalesceToPrintable(val['name'], typeof(val));
        const stack: string = coalesceToPrintable(val['stack'], `${ name }: ${ message }`);

        res = {
            message,
            name,
            stack,
        };
    }

    //console.log(`asError: res = ${ JSON.stringify({message: res.message, name: res.name, stack: res.stack}) }`);
    return res;
}

/**
 * YError is an enhanced Error class that has a cause field.
 */
export class YError extends Error {
    private cause?: IError;

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
    constructor(message: string, cause?: any) {
        var messageSuffix = '';
        var stackSuffix = '';
        var yandere: IError | undefined = undefined;

        if (defined(cause)) {
            yandere = asError(cause);
            if (yandere.message) {
                messageSuffix = ': ' + yandere.message;
            }

            if (yandere.stack) {
                stackSuffix = "\n"
                    + "  ___________\n"
                    + "_/ Caused by \\___________" + "\n"
                    + yandere.stack;
            }
        }
        super(message + messageSuffix);
        this.name = "YError";
        this.stack += stackSuffix;
        
        if (defined(yandere)) {
            this.cause = yandere;
        }
    }
}


/**
 * Get the printable version of a value; if falsy, return the alternate instead.
 * 
 * @returns printable version of val iff truthy, else alternative
 */
function coalesceToPrintable(val: any, alternative: string): string {
    return val ? toPrintable(val) : alternative;
}

function defined(val: any): boolean {
    return typeof(val) !== 'undefined';
}

function toPrintable(val: any): string {
    if (typeof(val) === 'string') {
        return val;
    }

    var str = '';
    try {
        str = String(val);
    } catch {
        // do nothing
    }

    var json = '';
    try {
        json = JSON.stringify(val);
    } catch {
        // do nothing
    }

    var res = '';
    if (json) {
        if (str === '[object Object]' || str === json || val instanceof Array) {
            res = json;
        } else {
            res = `${str} ${json}`;
        }
    } else {
        res = str;
    }

    return res;
}
