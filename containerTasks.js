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
} = require('./contaier');

const prop = curry((prop, x) => x[prop]);
const id = x => x;
const fMap = curry((f, anyFunctor) => anyFunctor.map(f));
  
const isTrue = x => !!x

const trace = curry((tag, x) => {
    console.log('DEBUG:: ', tag, x);
    return x;
});
const head = (x) => x[0];

const append = curry((what, to) => `${what}${to}`)

// safeProp:: String => Maybe Any
const safeProp = p => pipe(fMap(prop(p)), Maybe.of);

const left = x => new Left(x);

// Упражнение A

// pipe(fMap(prop), Maybe.of);

// console.log(pipe(fMap(prop('f')), trace('safeprop val'), safeProp('q'))({b: '123'}));

// incrF :: Functor f => f Int -> f Int  
// const incrF = fMap(add(1));
// const incrF = pipe(fMap(add(1)), Identity.of);  

// console.log(incrF(1));

// Упражнение B

const user = { id: 2, name: 'aka', active: true };  

// // initial :: User -> Maybe String 
// const initial = x => pipe(fMap(head), safeProp(x));  

// console.log(initial('name')(user))

// Упражнение C

// showWelcome:: User => String
const showWelcome = pipe(append('Welcome '), prop('name'))

// // checkActive:: User => Either String User
const checkActive = function checkActive(user) {
    return prop('active', user)
      ? Either.of(user)
      : left('Your account is not active');
  };

// // eitherWelcome :: User => Either String String
const eitherWelcome = pipe(fMap(showWelcome), checkActive);

// console.log(eitherWelcome(user))

// Упражнение D

const either = curry((f, g, e) => {
    let result;
    
    switch (e.constructor) {
      case Left:
        result = f(e.$value);
        break;
  
      case Right:
        result = g(e.$value);
        break;
    }
  
    return result;
});

const validateUser = curry((validate, user) => validate(user).map(id));

// validate :: fn => User => Either String User
const validate = curry((pattern, errorName, what) => {
    console.log(pattern, what, pattern(what));
    return pattern(what) ? Either.of(what) : Left.of(errorName)
})

// moreThanLength :: number => string => Boolean
const moreThanLength = curry((num, str) => str.length > num);

// moreThan3Length :: Any => Either String Boolean
const moreThan3Length = validate(pipe(moreThanLength(3), prop('name')), 'Username length must be 3 <');

// validateName :: User => Either String Boolean
const validateName = pipe(moreThan3Length);

const save = user => new IO(() => ({ ...user, saved: true }));

const saveAndWelcome = pipe(map(showWelcome), save);

const register = pipe(either(IO.of, saveAndWelcome), validateUser(validateName));

const registerUser = register(user);
console.log(registerUser.UNSAFEPerformIO());