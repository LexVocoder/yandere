# yandere
Javascript/Typescript library that provides browser- and Observable-friendly error wrappers, inspired by verror.

## Installation 
```sh
    npm install yandere --save
    yarn add yandere
    bower install pluralize --save
```
## Usage

### Javascript import
```javascript
    var yandere = require('yandere');
    var YError = yandere.YError;
```

### Typescript import

```typescript
    import { YError } from 'yandere';
```

#### With try/catch
```javascript
    try {
        hamSandwich.insert(thingy);
    } catch (originalError) {
        throw YError("cannot insert thingy into ham sandwich", originalError);
        // or throw new YError(...);
    }
```

* Stack traces from the thrown YError include the original error's trace.
* The YError's `message` field has both "cannot insert thingy into ham sandwich" and the original error's message.

#### With Observable subscriptions (RxJS)

```javascript
    myObservable.subscribe(
        result => /* ... */,
        error => myHandler.panic(new YError("trouble with myObserver", error))
        );
```

The `myHandler.panic` method has information about both this code and whatever code caused the earlier `error` to occur.

Further, the Typescript compiler doesn't complain about mismatching types, as YError really does support _any_ type for its second parameter -- even functions, symbols, and objects with circular references.  While such values might not be pretty when displayed, YError is pretty good about handling them without crashing.

## Technical details

#### String as a cause

```javascript
    var yerr = new YError("Cannot fetch document", "HTTP failure");
```

* `yerr.message` resembles, "Cannot fetch document: HTTP failure".
* `yerr.stack` contains its own stack trace, plus "Caused by" ... "HTTP failure".

#### Multiple causes

```javascript
    var yerr = new YError("Cannot fetch document",
        new YError("HTTP failure",
            new Error("Cannot resolve hostname")));
```

* `yerr.message === "Cannot fetch document: HTTP failure: Cannot resolve hostname"`
* `yerr.stack` resembles the following:
```
    YError: Cannot fetch document: HTTP failure: Cannot resolve hostname
        at apple (cactus.js:10:20)
        ...
        at banana (palm.js:30:40)
      ___________
    _/ Caused by \___________
    YError: HTTP failure: Cannot resolve hostname
        at cherry (oak.js:11:24)
        ...
        at kiwi (fuzz.js:31:36)
      ___________
    _/ Caused by \___________
    Error: Cannot resolve hostname
        at peach (keen.js:292:4)
        ...
        at orange (juice.js:384:12)
```


## Unit-testing yandere

```sh
npm install
npm run build
npm run test
```
