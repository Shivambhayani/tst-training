'use strict';

// BANKIST APP

// // Data
// const account1 = {
//     owner: 'Jonas Schmedtmann',
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 1111,
// };

// const account2 = {
//     owner: 'Jessica Davis',
//     movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//     interestRate: 1.5,
//     pin: 2222,
// };

// const account3 = {
//     owner: 'Steven Thomas Williams',
//     movements: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
// };

// const account4 = {
//     owner: 'Sarah Smith',
//     movements: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// / DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    // console.log(daysPassed);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMov = formatCur(mov, acc.locale, acc.currency);

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1
            } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
      `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter((int, i, arr) => {
            // console.log(arr);
            return int >= 1;
        })
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
// const createUsernames = function (accs) {
//     accs.forEach(function (acc) {
//         acc.username = acc.owners.toLowerCase().split(' ').map(name => name[0]).join('');
//     })
// }
createUsernames(accounts);

const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
};

// Timer
const startLogOutTimer = function () {
    const tick = function () {

        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;



        //  when 0 second , stop timer and log out user
        if (time === 0) {
            clearInterval(Timer),
                labelWelcome.textContent = `Log in to get started`
            containerApp.style.opacity = 0;
        }
        //  decrese seconds
        time--;
    };
    // set time to 5 min
    let time = 30;

    //  call timer every second
    tick();
    const Timer = setInterval(tick, 1000)
    return Timer;

}

// const updateUI = function (acc) {

//     //  movmentacc
//     displaymovment(acc.movements);

//     // balance
//     calcDisplayBalance(acc);

//     //  summary
//     calcDisplaySummary(acc);

// }

//  Event handler
let currentaccount, Timer;



//  fake always logged in ( for testing)
// currentaccount = account1;
// updateUI(currentaccount);
// containerApp.style.opacity = 100;

const currentdate = new Date();
labelDate.textContent = currentdate;


btnLogin.addEventListener('click', function (e) {
    // prevent orm for submiting
    e.preventDefault();

    currentaccount = accounts.find(acc => acc.owner === inputLoginUsername.value);
    console.log(currentaccount);

    if (currentaccount?.pin === Number(inputLoginPin.value)) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentaccount.owner.split(' ')[0]
            }`;
        containerApp.style.opacity = 100;

        //  experimenting api
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
        }
        const locale = navigator.language;
        console.log(locale);
        labelDate.textContent = new Intl.DateTimeFormat(currentaccount.locale, options).format(now);

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        //  Timer
        if (Timer) clearInterval(Timer);
        Timer = startLogOutTimer();



        // Update UI
        updateUI(currentaccount);
    }
})

//  Transfer money
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
        acc => acc.owner === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';

    if (
        amount > 0 &&
        receiverAcc &&
        currentaccount.balance >= amount &&
        receiverAcc?.owner !== currentaccount.owner
    ) {
        //  doing the transfer
        currentaccount.movements.push(-amount);
        receiverAcc.movements.push(amount)
        // add transfr date
        currentaccount.movements.push(new Date())
        receiverAcc.movements.push(new Date())

        // 
        updateUI(currentaccount)
    }
    // console.log(amount, receiverAcc);

});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log('deler');
    if (inputCloseUsername.value === currentaccount.owner && Number(inputClosePin.value) === currentaccount.pin) {
        const index = accounts.findIndex(
            acc => acc.owner === currentaccount.owner
        );
        console.log(index);

        //     delet the account
        accounts.splice(index, 1)

        //  hide ui
        containerApp.style.opacity = 0;

    }
    inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentaccount.movements.some(mov => mov >= amount * 0.1)) {
        setTimeout(function () {
            //  Add movement
            currentaccount.movements.push(amount);

            //  add time 
            currentaccount.movementsDates.push(new Date().toISOString());

            //   update ui
            updateUI(currentaccount)

            // reset time

        }, 2500);
    }
    inputLoanAmount.value = '';
});


// fake ALWAYS logged in




const accountmovment = accounts.map(acc => acc.movements).flat().reduce((acc, curr) => acc + curr, 0);

// console.log(accountmovment);
// 
// flatmap
const overallbalance = accounts
    .flatMap(acc => acc.movements)
    .reduce((acc, curr) => acc + curr, 0);
// console.log(overallbalance);

// sort
// const owner = ['shivam', 'shyam', 'ram', 'arjun', 'bhavesh'];
// console.log(owner.sort());

let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentaccount.movements, !sorted);
    sorted = !sorted;
})





//  return < 0,a,b (keep order)
//  return > 0, b ,a (switch order)

//  acending
// movements.sort((a, b) => {
//     if (a > b) return 1;
//     if (b > a) return -1;
// });
movements.sort((a, b) => a - b);
// console.log(movements);

//  decending
movements.sort((a, b) => b - a);
// movements.sort((a, b) => {
//     if (a > b) return -1;
//     if (b > a) return 1;
// });
// console.log(movements);


// const n = [-4, -20, -900, 2, 3, 4, 5, 6, 9, 9];
// console.log(n);
// console.log(n.sort((a, b) => {
//     if (a > b) return 1;
//     if (b > a) return -1;

// }));

// const allmovment = accountmovment.flat();
// console.log(allmovment);

// const overallbalance = allmovment.reduce((acc, curr) => acc + curr, 0)
// console.log(overallbalance);

//  Fill method

const arr = [1, 2, 3, 4, , 5, 6];
// console.log(new Array(1, 2, 3, 4, 5, 6));

const x = new Array(8);
// console.log(x);
// console.log(x.fill(1, 3, 5));
// console.log(x.fill(10));














// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const dice = Array.from({ length: 100 }, (_, i) => (i, Math.trunc(Math.random * 6) + 1) + 1)
// console.log(dice);



//  array method Practice
//  1
const bankalldeposite = accounts.flatMap(acc => acc.movements)
    .filter(mov => mov > 0)
    .reduce((a, b) => a + b, 0)
// console.log(bankalldeposite);

//  2 at least 1000

const onethdepo = accounts
    .flatMap(acc => acc.movements)
    // .filter(acc => acc > 1000)
    // .reduce((acc, cur) => acc >= 1000 ? ++acc : acc, 0)
    .reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0);
// console.log(onethdepo);

//  3

// const { deposite, withdrawal } = accounts
//     .flatMap(acc => acc.movements)
//     .reduce(
//         (sums, curl) => {
//             sums[curl > 0 ? 'deposite' : 'withdrawal'] += curl;
//             return sums;
//         },
//         { deposite: 0, withdrawal: 0 }
//     );
// console.log(deposite, withdrawal);

// const converttitle = function (title) {
//     const exception = ['a', 'an', 'the', 'but', 'or', 'on', 'with'];

//     const titlecase = title.toLowerCase()
//         .split(' ')
//         .map(word =>
//             exception.includes(word) ? word : word[0].toUpperCase() + word.slice(1))
//         .join(' ')
//     return titlecase;
// }

// console.log(converttitle("this is a nice title"));
// console.log(converttitle('this is a Long Title but not'));
// console.log(converttitle('and here is another example With title'));

//  some method
const any = movements.some(mov => mov > 500);
// console.log(any);

// //  every method if all consdition is true than its return true
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // sepate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));


// flat method
const f = [1, 2, 3, [4, 5]];
// console.log(f.flat());

const f2 = [0, 1, [2, [3, [4, 5]]]]
// console.log(f2.flat(2));
// console.log(f2.flat(Infinity));

// /////////////////////////////////////////////////

///////////////////////////////////////
// Coding Challenge #1

/*
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//     const julicorrect = dogsJulia.slice();
//     julicorrect.splice(0, 1);
//     julicorrect.splice(-2);

//     const dogs = julicorrect.concat(dogsKate);
//     console.log(dogs);

//     dogs.forEach(function (dog, i) {
//         if (dog >= 3) {
//             console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);

//         } else {
//             console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//         }
//     });

// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3])

//  find method
// const firstwithdrwal = movements.find(mov => mov < 0);
// // console.log(firstwithdrwal);

// const account = accounts.find(acc => acc.owner === 'Steven Thomas Williams')
// // console.log(account);

///////////////////////////////////////
// Coding Challenge #2

/*
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (dogage) {


//     const humanages = dogage.map(dogage => (dogage <= 2 ? 2 * dogage : 16 + dogage * 4));
//     const adults = humanages.filter(dogage => dogage >= 18);
//     console.log(humanages);
//     console.log(adults);

//     const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//     return average;

// }
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])
// console.log(avg1, avg2);

//  chsllenge 3 convert into arroe function and using chainnig

// const calcHumanavg = (age) =>
//     age
//         .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//         .filter(age => age >= 18)
//         .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const avg1 = calcHumanavg([5, 2, 4, 1, 15, 8, 3]);
// console.log(avg1);
// const avg2 = calcHumanavg([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg2);



// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

//  1
dogs.forEach(dogs => (dogs.recfood = Math.trunc(dogs.weight ** 0.75 * 28)));

//  2
const sarsh = dogs.find(dogs => dogs.owners.includes('Sarah'));
// console.log(sarsh);

// console.log(
//     `sarah dog eat to ${sarsh.curFood > sarsh.recfood ? 'much' : 'little'
//     }`);

// 3
// const ownersEatTooMuch = dogs
//     .filter(dog => dog.curFood > dog.recfood)
//     .flatMap(dogs => dogs.owners)
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//     .filter(dog => dog.curFood < dog.recfood)
//     .flatMap(dogs => dogs.owners)
// console.log(ownersEatTooLittle);

// //  4

// console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much ! and ${ownersEatTooLittle.join(' and ')} dogs eat too little!`);

// //  5
// console.log(dogs.some(dog => dog.curFood === dog.recfood));

// // 6 any

// const checkingokaly = dog => dog.curFood > dog.recfood * 0.90 && dog.curFood < dog.recfood * 1.10;
// console.log(dogs.some(checkingokaly));

// //  7
// console.log(dogs.filter(checkingokaly));

// //  8 sort by recombded food
// const sorting = dogs.sort((a, b) => a.recfood - b.recfood);
// console.log(sorting);

