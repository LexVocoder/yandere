'use strict';
var expect = require('chai').expect;
var yandere = require('../dist/index.js');
var YError = yandere.YError;
var asError = yandere.asError;

describe("yandere's", () => {
    describe('asError', () => {
        function helper(val) {
            var result = asError(val);
            expect(result.message).to.not.be.undefined;
            expect(result.message).to.not.be.null;

            return result;
        }
        it('works with undefined', () => helper(undefined));
        it('works with null', () => helper(null));
        it('works with false', () => helper(false));
        it('works with true', () => helper(true));
        it('works with zero', () => helper(0));
        it('works with integer number', () => helper(42));
        it('works with real number', () => helper(10/9));
        it('works with empty symbol', () => helper(Symbol()));
        it('works with symbol', () => helper(Symbol("status")));
        it('works with empty string', () => helper(""));
        it('works with string', () => helper("foo"));
        it('works with empty array', () => helper([]));
        it('works with array', () => helper([null, false, true, 0, 42, 10/9, Symbol(), Symbol("status"), "", "foo", {}]));
        it('works with empty object', () => helper({}));
        it('works with object', () => helper({"x": 42}));
        it('works with function', () => helper(function (x) { return x + 1; }));
        it('works with Error', () => helper(new Error("confessor")));
        it('works with YError', () => helper(YError("yandere")));
        it('works with YError with cause', () => helper(YError("snitch", "confessor")));
        it('works when object has circular references', () => {
            var obj = {};
            obj['selfPointer'] = obj;
            helper(obj);
        });
    });
    describe('YError constructor', () => {
        it('is valid when no cause given', () => {
            var result = YError('fatal');
            expect(result.message).to.equal('fatal');
            expect(result.stack).to.be.not.empty;
            expect(result.stack).to.not.contain("Caused by");
        });

        it('is valid when cause is an Error', () => {
            var cause = new Error("confessor");
            var result = YError('snitch', cause);
            expect(result.message).to.equal('snitch: confessor');
            expect(result.stack).to.contain(cause.stack);
        });

        it('is valid when cause is a string', () => {
            var cause = "cheese";
            var causeError = asError(cause);

            var result = YError('snitch', cause);
            expect(result.message).to.equal('snitch: cheese');
            expect(result.stack).to.contain("YError: snitch");
            expect(result.stack).to.contain("Caused by");
            expect(result.stack).to.contain(causeError.stack);
        });

        it('is valid when cause is IError', () => {
            var cause = {
                message: "confessor",
                name: "CustomError",
                stack: "pancakes"
            };
            var causeError = asError(cause);

            var result = YError('snitch', cause);
            expect(result.message).to.equal('snitch: confessor');
            expect(result.stack).to.contain("YError: snitch");
            expect(result.stack).to.contain("Caused by");
            expect(result.stack).to.contain("pancakes");
        });
    });
});
