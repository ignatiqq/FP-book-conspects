const curry = (fn) => {
    const argsLength = fn.length;
    return function curried(...args) {
        if(args.length < argsLength) {
            return fn.bind(this, ...args);
        }
        return fn(...args);
    }
}

const pipe = (...fns) => (...args) => Array.from(fns).reduceRight((acc, val) => {
    return [val(...acc)];
}, args)[0];


const trace = curry((tag, x) => {
    console.log('DEBUG:: ', tag, x);
    return x;
});

class Identity {
    constructor(x) {
        this.$value = x;
    }

    static of(x) {
        return new Identity(x);
    }

    map(f) {
        return Identity.of(f(this.$value));
    }
}

// const plus2 = x => x + 2; 

// const firstIdentity = Identity.of(2);
// const secondIdentity = Identity.of(3).execute((val) => val);

// console.log(firstIdentity === firstIdentity.execute(plus2));

// console.log(Identity.of(2));
// console.log(Identity.of(3).execute(plus2));

// FUNCTOR MAYBE

class Maybe {

    static of(x) {
        return new Maybe(x)
    }

    constructor(x) {
        this.$value = x;
    }

    isNothing() {
        return this.$value === null || this.$value === undefined || (typeof this.$value === 'number' ? isNaN(this.$value) : false);
    }

    map(fn) {
        return this.isNothing() ? this : Maybe.of(fn(this.$value));
    }

}

const match = curry((x, y) => y.match(x));
const prop = curry((x,y) => y[x]);
const add = curry((x,y) => x + y);
// trycatch условный
const maybe = curry((v, f, m) => {
    if (m.isNothing) {
      return v;
    }
  
    return f(m.$value);
});


// // console.log(Maybe.of('Hello world!').map(match(/world!/ig)));
// // console.log(Maybe.of(null).map(match(/a/ig)));
// // console.log(Maybe.of({ name: 'Boris' }).map(prop('age')).map(add(10)));
// // console.log(Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10)));

// const withdraw = curry((amount, { balance }) =>
//   Maybe.of(balance >= amount ? { balance: balance - amount } : null));

// // This function is hypothetical, not implemented here... nor anywhere else.
// // updateLedger :: Account -> Account 
// const updateLedger = account => account;

// // remainingBalance :: Account -> String
// const remainingBalance = ({ balance }) => `Your balance is $${balance}`;

// // finishTransaction :: Account -> String
// const finishTransaction = pipe(remainingBalance, updateLedger);


// // getTwenty :: Account -> Maybe(String)
// const getTwenty = pipe(maybe('Broken', finishTransaction), withdraw(20));

// // Nothing

// console.log(getTwenty({balance: 19}))


class Either {
    static of(x) {
        return new Right(x);
    }

    constructor(x) {
        this.$value = x;
    }

}

class Left extends Either {
    static of(val) {
        return new Left(val);
    }

    map(fn) {
        return this;
    }
}

class Right extends Either {
    map(fn) {
        return Either.of(fn(this.$value));
    }
}

// console.log(Either.of('rain').map(str => `b${str}`));

// console.log(new Left('rain').map(str => `It's gonna ${str}, better bring your umbrella!`));

// console.log(Maybe.of('rain').map(str => `b${str}`));

// console.log(Maybe.of('rain').map(str => `It's gonna ${str}, better bring your umbrella!`));

// const pseudoWindow = {
//     innerWidth: '1233'
// }

// ioWindow :: IO Window
// const ioWindow = new IO(() => pseudoWindow);

// ioWindow.map(win => win.innerWidth);
// IO(1430)

// ioWindow
//   .map(prop('location'))
//   .map(prop('href'))
//   .map(split('/'));
// IO(['http:', '', 'localhost:8000', 'blog', 'posts'])


// // $ :: String -> IO [DOM]
// const $ = selector => new IO(() => document.querySelectorAll(selector));

// $('#myDiv').map(head).map(div => div.innerHTML);
// // IO('I am some inner html')

class IO {
    static of(x) {
        // 
      return new IO(() => x);
    }
  
    constructor(fn) {
        // this.$value = () => pseudoWindow
        // () => pseudoWindow => (win) => win.innerWidth
      this.$value = fn;
    }
  
    map(fn) {
        // this.$value = () => pseudoWindow
        // fn = win => win.innerWidth
        // () => pseudoWindow => (win) => win.innerWidth
      return new IO(pipe(fn, this.$value));
    }

    UNSAFEPerformIO() {
        return this.$value();
    }
  
    // inspect() {
    //   return `IO(${inspect(this.$value)})`;
    // }
}

const find = curry((cb, w) => w.find(cb));
const split = curry((how, x) => {
    return x.split(how)
});
const map = curry((cb, x) => x.map(cb));
const last = x => x[x.length - 1];
const head = x => x[0];
const equal = curry((x, y) => x === y);

const fMap = curry((f, anyFunctor) => anyFunctor.map(f));

// toPairs :: String -> [[String]]
const toPairs = pipe(map(split('=')), split('&'));

// params :: String -> [[String]]
const params = pipe(toPairs, last, split('?'));

// pipe(pipe(Maybe.of, toPairs, params), () => 'https://localhost:8080/hello?hello=bar&searchTerm=123');

const url = new IO(() => 'https://localhost:8080/hello?hello=bar&searchTerm=123');
//                            /                                                  /

// findParam :: String => IO Maybe [String, String]
const findParam = key => fMap(pipe(Maybe.of, find(pipe(equal(key), head)), params), url);

// вернулся контейнер и мы можем выполнить сайд эффект с любым из контейнером
// здесь предпочтительно использовать Maybe.map так как мы ответсттвенны за переданное значение
// в теории его может не быть, поэтому мы перестрахуемся и вызовем fMap
// console.log(findParam('searchTerm').UNSAFEPerformIO());

/// exports

module.exports = {
    IO,
    Maybe,
    Either,
    Identity,
    Left,
    Right,
    map,
    fMap,
    curry,
    pipe,
    add,
    trace,
}