'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-10-01T23:36:17.929Z',
    '2023-10-05T10:51:36.790Z',
  ],
  interestRate: 1.2, // %
  pin: 1111,
  local: 'en-US',
  currency: 'USD',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
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
  interestRate: 1.5,
  pin: 2222,
  local: 'pt-PT',
  currency: 'EUR',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

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

// date function

const local = navigator.language;

const movementDate = function (date) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDay()}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${month}/${day}/${year}`;

    return new Intl.DateTimeFormat(local).format(date);
  }
};

const formatedCur = function (value, local, currency) {
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
// displaying movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = movementDate(date, acc.local);

    const formattedMov = formatedCur(mov, acc.local, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculate the total balance from the movements of the money
const displayCalcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatedCur(acc.balance, acc.local, acc.currency);
};

// calculating summary of the movements

// currency exchange from usd to eur

const USDtoEUR = 1.1;
const mapReduce = function (acc, mov, i) {
  map((mov, i) => mov * USDtoEUR).reduce((acc, mov) => acc + mov, 0);
};

// summary
const displayCalcSummary = function (acc) {
  const total = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatedCur(acc.balance, acc.local, acc.currency);

  const outTotal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatedCur(
    Math.abs(outTotal),
    acc.local,
    acc.currency
  );

  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatedCur(
    totalInterest,
    acc.local,
    acc.currency
  );
};

// giving usernames to the accounts

const givenUsername = function (accounts) {
  accounts.forEach(function (account, i) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

givenUsername(accounts);
const updateUI = function (acc) {
  displayMovements(acc);
  displayCalcBalance(acc);
  displayCalcSummary(acc);
};

//current date function
const curBalancDate = function () {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
  };

  const local = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
};

const setLogoutTimer = function () {
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//login to the account and the date

let currentAccount, timer;

//logging into the account directly for testing purpose

// currentAccount = account2;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//date format we will be displaying is mm/dd/yyyy

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
  }

  // display welcome message
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }`;
  //display ui
  containerApp.style.opacity = 100;

  curBalancDate();

  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  //display movements
  updateUI(currentAccount);

  if (timer) clearInterval(timer);
  timer = setLogoutTimer();
});

//transfer money to an account

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const recieveAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = Number(inputTransferAmount.value);

  if (
    transferAmount > 0 &&
    recieveAccount &&
    currentAccount.balance >= transferAmount &&
    recieveAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    recieveAccount.movements.push(transferAmount);

    currentAccount.movementsDates.push(new Date());
    recieveAccount.movementsDates.push(new Date());

    updateUI(currentAccount);
  }

  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  learInterval(timer);
  timer = setLogoutTimer();
});

//close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const closeUsername = inputCloseUsername.value;
  const closePin = inputClosePin.value;

  if (
    currentAccount.username === closeUsername &&
    currentAccount.pin === Number(closePin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  closeUsername = '';
  closePin = '';
});

//loan button

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  )
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);

      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
    }, 6000);

  inputLoanAmount.value = '';

  learInterval(timer);
  timer = setLogoutTimer();
});

// sort button

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
