// main

const pipe = (...fns) => (...args) => Array.from(fns).reduceRight((acc, val) => {
    return [val(...acc)];
}, args)[0];

const curry = (fn) => {
    const argsLength = fn.length;
    return function curried(...args) {
        if(args.length < argsLength) {
            return fn.bind(this, ...args);
        }
        return fn(...args);
    }
}

// helpers

// debug 

const trace = curry((tag, x) => {
    console.log('DEBUG:: ', tag, x);
    return x;
});

// debug

const map = curry((fn, data) => data.map(fn));
const reduce = curry((cb, x) => x.reduce((acc, currentVal, index, arr) => cb(acc, currentVal, index, arr)));
const prop = curry((prop, x) => x[prop]);


// const repeat = (str, val) => str.repeat(val);
// const repeatFiveTimes = curry(string => repeat(string, 5));
// const joinByT = curry(arr => arr.join('T'));
// const allSplit = curry(str => str.split(''));
// const reverse = string => string.reverse()

// const repeatedFiveTimesAndReverseString = pipe(
//     joinByT,
//     reverse,
//     allSplit,
//     repeatFiveTimes
// );

// console.log(repeatedFiveTimesAndReverseString('hello', 3));

/**
 * homework ch05.md
 */

// ex1 

// rewrite with compose: 

// const isLastInStock = (cars) => {  
//     const lastCar = last(cars);  
//     return prop('in_stock', lastCar);  
// };

// data 

const cars = [
    {
        name: 'Aston Martin One-77',
        horsepower: 750,
        dollar_value: 1850000,
        in_stock: true,
    },
    {
        name: 'VAZ 2101',
        horsepower: 100,
        dollar_value: 2000,
        in_stock: false,
    },
];

// // helpers
// const last = (x) => x[x.length - 1];
// const curriedProp = curry(prop);

// solution

// const isLastInStock = pipe(curriedProp('in_stock'), last);
// console.log(isLastInStock(cars));

// ex 2

const plus = curry((first, second) => first + second);

const average = xs => {
    return reduce(plus, xs);
}

// refactor

// const averageDollarValue = (cars) => {  
//     const dollarValues = map(c => c.dollar_value, cars);  
//     return average(dollarValues);  
// };  

// solution

// averageDollarValue :: Array<CarsType> -> String
const averageDollarValue = pipe(
    average,
    map(prop('dollar_value')),
);

console.log(averageDollarValue(cars));
