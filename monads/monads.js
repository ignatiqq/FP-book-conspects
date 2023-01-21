const {
    IO,
    Maybe,
    Either,
    Identity,
    Right,
    Left,
    map,
    curry,
    pipe,
    add,
    fMap,
    // monad utils
    fJoin,
} = require('../contaier');

const trace = curry((tag, x) => {
    console.log('DEBUG:: ', tag, x);
    return x;
});
const head = x => x[0];

const fs = require('fs');
const path = require('path');

// MONADS UTILS::: 

const flatMap = curry((fn, functor) => functor.map(fn).join());

module.exports = {flatMap};

// MONAD UTILS ENDDDD

// readFile :: String -> IO String
const readFile = filename => new IO(() => fs.readFileSync(filename, 'utf-8'));

// print :: String -> IO String
const print = x => new IO(() => {
  return x;
});

// cat :: String -> IO (IO String)
const cat = pipe(fMap(print), readFile);

// const testTsx = cat(path.join(__dirname, './test.txt'));
// console.log(testTsx.UNSAFEPerformIO().UNSAFEPerformIO())

// const catFirstChar = pipe(fMap(fMap(head)), cat);

// console.log(catFirstChar(path.join(__dirname, './test.txt')).UNSAFEPerformIO())



// 
const safeProp = curry((x, obj) => Maybe.of(obj[x]));

// safeHead :: [a] -> Maybe a
const safeHead = safeProp(0);

// firstAddressStreet :: User -> Maybe (Maybe (Maybe Street))
const firstAddressStreet = pipe(
  flatMap(safeProp('street')),
  flatMap(safeHead),
  safeProp('addresses'),
);

// console.log(firstAddressStreet({
//   addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
// }));

// IO MONADS TEST

const log = x => new IO(() => {
    console.log(x);
    return x;
});

// console.log(log('x').UNSAFEPerformIO());

// SOME НЕЧИСТЫЙ STUFF
const getItem = key => new IO(() => ({hello: 'world'}[key]));

const someFn = pipe(
    flatMap(log),
    getItem
);

someFn('hello').UNSAFEPerformIO();