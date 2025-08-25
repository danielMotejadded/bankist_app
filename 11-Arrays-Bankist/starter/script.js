'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const movements = [200, 450, -400, 3800, -650, -130, 70, 1300];

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'premium',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'basic',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'standard',
};

const accounts = [account1, account2, account3, account4];

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

//-------------FUNCTIONS---------------------

// CREATE USERNAMES
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};

// DISPLAY MOVEMENTS
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// DISPLAY BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${acc.balance}€`;
};

// DISPLAY SUMMARY

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`;
};

createUserNames(accounts);

// UPDATE UI

const updateUI = function (acc) {
  //Display movements

  displayMovements(acc.movements);

  //Display balance

  calcDisplayBalance(acc);

  //Display summary

  calcDisplaySummary(acc);
};

let currentAccount;

// Event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    currentAccount?.username !== receiverAcc.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    // SOME
    currentAccount.movements.some(mov => mov >= (amount * 1) / 10)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    inputClosePin.value = inputCloseUsername.value = '';
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*

//SIMPLE ARRAY METHODS

let arr = ['a', 'b', 'c', 'd', 'e'];
//slice method
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

//splice method
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE MUTATES ARRAY
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));

const arr = [23, 11, 65];

console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));




movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1} You withrdrew ${Math.abs(movement)}`);
  }
});
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});



const eurToUsd = 1.1;

const movementsUSD = movements.map(mov => Math.floor(mov * 1.1));

console.log(movements, movementsUSD);

const movementsUSD2 = [];
for (const mov of movements) {
  movementsUSD2.push(Math.floor(mov * 1.1));
}

console.log(movementsUSD2);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'} ${mov}`
);

console.log(movementsDescriptions);

console.log(movements);
// Reduce Method
// acumulator -> SNOWBALL
const balance = movements.reduce((acc, cur, i) => acc + cur, 0);

console.log(balance);

let balanceFor = 0;

for (const [i, el] of movements.entries()) {
  console.log(`Iteration number ${i}: ${balanceFor}`);
  balanceFor += el;
}
 
// Maximum value
const maxValue = movements.reduce((acc, mov) => (acc > mov ? acc : mov), 0);
console.log(maxValue);

const calcAverageHumanAge = function (ages) {
  const array = ages.map(function (age) {
    if (age <= 2) {
      age = 2 * age;
      return age;
    } else {
      age = age * 4 + 16;
      return age;
    }
  });
  console.log(array);
  const filteredArray = array.filter(age => age >= 18);
  const averageAdultAge = filteredArray.reduce(function (acc, age, i, arr) {
    console.log(acc + age);
    return acc + age / arr.length;
  }, 0);

  return averageAdultAge;
};

console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov < 0)
  .map((mov, i, arr) => {
    console.log(arr);
    mov * 1.1;
  })
  .reduce((acc, mov) => acc + mov);

const ages = [5, 2, 4, 1, 15, 8, 3];

const calcAverageHumanAge = function (ages) {
  const array = ages.map(function (age) {
    if (age <= 2) {
      age = 2 * age;
      return age;
    } else {
      age = age * 4 + 16;
      return age;
    }
  });
  console.log(array);
  const filteredArray = array.filter(age => age >= 18);
  const averageAdultAge = filteredArray.reduce(function (acc, age, i, arr) {
    console.log(acc + age);
    return acc + age / arr.length;
  }, 0);
};

const calcAverageHumanAgeArrow = ages
  .map(age => (age <= 2 ? (age = age * 2) : (age = age * 4 + 16)))
  .filter(age => age >= 18)
  .reduce((acc, age, i, arr)=> acc + age / arr.length, 0);
console.log(calcAverageHumanAgeArrow)

// THE FIND METHOD

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc);
  }
}

// findLast and findlastIndex
const lastWithdrawal = movements.findLast(mov => mov > 2000);
console.log(lastWithdrawal);

const lastWithdrawalIndex = movements.indexOf(lastWithdrawal);

const calculation = movements.length - lastWithdrawalIndex - 1;
const str = `Your latest large movement was ${calculation} movements ago`;

console.log(str);


// FLAT AND FLATMAP

const arr = [[1, 2], 3, 4, [5, 6, 7], 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const overallBalance = accounts
  .map(owner => owner.movements)
  .flat()
  .reduce((acc, mov) => acc + mov);
console.log(overallBalance);

// flatMap
const overallBalance2 = accounts
  .flatMap(owner => owner.movements)
  .reduce((acc, mov) => acc + mov);
console.log(overallBalance2);



const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

//1
const huskyWeight = breeds.find(el => el.breed === 'Husky').averageWeight;
console.log(huskyWeight);

//2
const dogBothActivities = breeds.find(el =>
  el.activities.includes('running', 'fetch')
);
console.log(dogBothActivities);

//3
const array = breeds.flatMap(obj => obj.activities);
console.log(array);

// 4
const uniqueActivities = new Set(array);
console.log(uniqueActivities);

//5
const swimmingAdjacent = breeds
  .filter(el => el.activities.includes('swimming'))
  .flatMap(el => el.activities)
  .filter(el => el != 'swimming');
const uniqueSwimmingAdjacent = new Set(swimmingAdjacent);
console.log(uniqueSwimmingAdjacent);

const decision =
  breeds
    .map(el => el.averageWeight)
    .reduce((acc, el, i, arr) => Math.floor(acc + el / arr.length), 0) === 10;

console.log(decision);
const activeDogs = breeds.filter(el => el.activities.length === 3);
console.log(activeDogs);

const averageWeight = breeds
  .filter(el => el.activities.includes('fetch'))
  .map(el => el.averageWeight);

const max = Math.max(...averageWeight);

console.log(max);

// ARRAY SORTING



const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());



// SORT METHOD
// return < 0 A, B
// return > 0 B, A
movements.sort((a, b) => a-b);
console.log(movements)


// ARRAY GROUPING

const movements = [200, 450, -400, 3800, -650, -130, 70, 2300];

console.log(movements);

const groupedMovements = Object.groupBy(movements, movement =>
  movement > 0 ? 'deposits' : 'withdrawals'
);

console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});

console.log(groupedByActivity);

const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);

console.log(groupedAccounts);
*/
/////////////////////////////////////////////////

// Creating Arrays

const x = new Array(7);
x.fill(1, 3);
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7, 8];
arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);

const diceRolls = Array.from({ length: 100 }, (cur, i) =>
  Math.floor(Math.random() * 6 + 1)
);

labelBalance.addEventListener('click', function () {
  const movements = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.slice(0, -1))
  );
  console.log(movements);

  const movements2 = [...document.querySelectorAll('.movements__value')];

  console.log(movements2)
});
