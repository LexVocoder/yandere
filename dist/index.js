"use strict";
// Yandere - error utilities for yonder error
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * asError casts any value to an Error-like object.  It is VERY unlikely to throw exceptions.
 */
function asError(val) {
    var res;
    if (val instanceof Error) {
        res = val;
    }
    else if (!defined(val)) {
        res = {
            message: 'undefined',
            name: '',
            stack: 'undefined',
        };
    }
    else if (val === null) {
        res = {
            message: 'null',
            name: 'object',
            stack: 'object: null',
        };
    }
    else if (val === "") {
        res = {
            message: '(empty string)',
            name: 'string',
            stack: '(empty string)',
        };
    }
    else if (typeof (val) === 'string') {
        res = {
            message: val,
            name: typeof (val),
            stack: val,
        };
    }
    else {
        var message = coalesceToPrintable(val['message'], toPrintable(val));
        var name_1 = coalesceToPrintable(val['name'], typeof (val));
        var stack = coalesceToPrintable(val['stack'], name_1 + ": " + message);
        res = {
            message: message,
            name: name_1,
            stack: stack,
        };
    }
    //console.log(`asError: res = ${ JSON.stringify({message: res.message, name: res.name, stack: res.stack}) }`);
    return res;
}
exports.asError = asError;
/**
 * YError is an enhanced Error class that has a cause field.
 */
var YError = /** @class */ (function (_super) {
    __extends(YError, _super);
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
    function YError(message, cause) {
        var _this = this;
        var messageSuffix = '';
        var stackSuffix = '';
        var yandere = undefined;
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
        _this = _super.call(this, message + messageSuffix) || this;
        _this.name = "YError";
        _this.stack += stackSuffix;
        if (defined(yandere)) {
            _this.cause = yandere;
        }
        return _this;
    }
    return YError;
}(Error));
exports.YError = YError;
/**
 * Get the printable version of a value; if falsy, return the alternate instead.
 *
 * @returns printable version of val iff truthy, else alternative
 */
function coalesceToPrintable(val, alternative) {
    return val ? toPrintable(val) : alternative;
}
function defined(val) {
    return typeof (val) !== 'undefined';
}
function toPrintable(val) {
    if (typeof (val) === 'string') {
        return val;
    }
    var str = '';
    try {
        str = String(val);
    }
    catch (_a) {
        // do nothing
    }
    var json = '';
    try {
        json = JSON.stringify(val);
    }
    catch (_b) {
        // do nothing
    }
    var res = '';
    if (json) {
        if (str === '[object Object]' || str === json || val instanceof Array) {
            res = json;
        }
        else {
            res = str + " " + json;
        }
    }
    else {
        res = str;
    }
    return res;
}
