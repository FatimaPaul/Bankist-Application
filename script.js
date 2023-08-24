'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-02-18T21:31:17.178Z',
    '2023-02-23T07:42:02.383Z',
    '2023-03-28T09:15:04.904Z',
    '2023-04-30T10:17:24.185Z',
    '2023-04-29T17:01:17.194Z',
    '2023-05-01T23:36:17.929Z',
    '2023-05-01T09:03:00.790Z',
    '2023-05-02T09:03:00.790Z',
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

// 🌴 DOM SELECTION
const containerMovements = document.querySelector(".movements");
const containerApp = document.querySelector(".app");

const textBalance = document.querySelector(".balance__value");
const textSummaryIn = document.querySelector(".summary__value--in");
const textSummaryOut = document.querySelector(".summary__value--out");
const textSummaryInterest = document.querySelector(".summary__value--interest");
const btnSort = document.querySelector(".btn--sort");
const labelBalance = document.querySelector(".balance");

const loginUser = document.querySelector(".login__input--user");
const loginPin =document.querySelector(".login__input--pin");
const loginButton = document.querySelector(".login__btn");

let inputTransferTo = document.querySelector(".form__input--to");
let inputTransferAmount = document.querySelector(".form__input--amount");
const transfersButton =document.querySelector(".form__btn--transfer");

const loanButton = document.querySelector(".form__btn--loan");
const loanAmount = document.querySelector(".form__input--loan-amount");

const closeButton = document.querySelector(".form__btn--close");
const closeUser = document.querySelector(".form__input--user");
const closePin = document.querySelector(".form__input--pin")

const welcomeText = document.querySelector(".welcome");
const labelTimer = document.querySelector(".timer");

// 🎯 Bankist application part 1
// global variables 
let currentAccount, timer, stl;

// Login Timer
const startTimerLogin = function(){
  let time = 40;
  const tick = function(){
      let min = `${Math.trunc(time / 60)}`.padStart(2, 0);
      let sec = `${time % 60}`.padStart(2, 0);
  
      labelTimer.textContent = `${min}:${sec}`;
      time--;

      if(time == 0){
        clearInterval(stl);
        labelTimer.textContent = `00:00`;
        // console.log("time out is cleared");
        welcomeText.textContent = `Login to get started`;
        containerApp.style.opacity = '0';
      }
  }
  tick();
  stl = setInterval(tick, 1000);
  return stl;
}

// format numbers and currency of movements
const formatNum = function(value, locale, currenccy){
  const opt = {
    style: 'currency', 
    currency: currenccy,
  }
  return new Intl.NumberFormat(locale, opt).format(value);
}

// display dates
const createDate = function(date, locale){
  const daysPass = function(date1, date2){
    return Math.round((Math.abs(date2 - date1))/(1000*24*60*60));
  }
  const daysPassed = daysPass(date, new Date());
  console.log(daysPassed);
  if(daysPassed === 0) {return 'Today'};
  if(daysPassed === 1) {return 'Yesterday'}
  if(daysPassed <= 7) {return `${daysPassed} day ago`};

  return new Intl.DateTimeFormat(locale).format(date);
}
// console.log(createDate(new Date()));

// display movements
const displayMovements = function(acc, sort = false){
    containerMovements.innerHTML = " ";
    const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;
    
    movs.forEach(function(mov, i){
        const type = mov > 0 && "deposit" || mov < 0 && "withdrawal";
        const dates = new Date(acc.movementsDates[i]);
        const displayDate = createDate(dates, acc.locale);
        // console.log(displayDate);
        // console.log(type);

        const html =  `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatNum(mov, acc.locale, acc.currency)}</div>
      </div>`;
       containerMovements.insertAdjacentHTML("afterbegin", html);
    });
}
// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

// Compute usernames 
const createUserName = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(" ").map(n => n[0]).join("");
  })
  return accs;
}
console.log(createUserName(accounts));

//display balance
const displayBalance = function(acc){
   acc.balance = (acc.movements).reduce(function(acc, curr){
    return acc + curr;
  }, 0); 
  textBalance.textContent = formatNum(acc.balance, acc.locale, acc.currency);
}
displayBalance(account1);

// calculate summary
const calculateSummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  textSummaryIn.textContent = formatNum(incomes, acc.locale, acc.currency);
  // console.log(incomes);

  const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  textSummaryOut.textContent = formatNum(Math.abs(outcomes), acc.locale, acc.currency);
  // console.log(outcomesFormat);

  const interests = acc.movements.filter(mov => mov > 0).map(deposit => deposit * (acc.interestRate/100)).filter(int => int >=1).reduce((acc, int) => acc + int, 0);
  textSummaryInterest.textContent = formatNum(interests, acc.locale, acc.currency);
  // console.log(interests);
}
calculateSummary(account1);

// finding names 
const finded = accounts.find(obj => obj.owner === 'Jessica Davis');
// console.log(finded);

// update UI 
const updateUI = function(acc){
  displayMovements(acc);
  displayBalance(acc);
  calculateSummary(acc);
}

// implementing login

loginButton.addEventListener("click", function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === loginUser.value);
  if(currentAccount?.pin === Number(loginPin.value)){
    console.log(currentAccount);

    // clear input fields
    loginPin.value = "";
    loginUser.value = "";
    loginPin.blur();

    // welcome UI and print the owner name
    welcomeText.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = '100';

    // create login date
    const date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(date);

    // logout timer
    if(timer) {
      clearInterval(stl);
      console.log(stl);
    }
    timer = startTimerLogin();
    
    //update UI
    updateUI(currentAccount);
  }
});

// implementing transfers
transfersButton.addEventListener("click", function(e){
  e.preventDefault();
  const reciever = accounts.find(acc => inputTransferTo.value === acc.username);
  let amount = Number(inputTransferAmount.value);
  inputTransferTo.value = "";
  inputTransferAmount.value = "";

  // transfer date
  currentAccount.movementsDates.push(new Date());
  reciever.movementsDates.push(new Date());


  if(amount > 0 && currentAccount.balance >= amount && currentAccount.username !== reciever.username && reciever.username){
    // console.log("transfered");
    reciever.movements.push(amount);
    currentAccount.movements.push(-amount);
    updateUI(currentAccount);
    clearInterval(stl);
    startTimerLogin();
  }
});

// implementing close account 
closeButton.addEventListener("click", function(e){
  e.preventDefault();
  if(currentAccount.username === closeUser.value && currentAccount.pin === Number(closePin.value)){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

//implementing request loan 
loanButton.addEventListener("click", function(e){
  e.preventDefault();
  const amountLoan  = Math.floor(loanAmount.value);
  loanAmount.value = "";
  setTimeout(() =>{
    // request date
  currentAccount.movementsDates.push((new Date()).toISOString());
  if(amountLoan > 0 && currentAccount.movements.some(mov => mov > amountLoan / 10)){
    currentAccount.movements.push(amountLoan);
    updateUI(currentAccount);
    clearInterval(stl);
    startTimerLogin();
  }
  }, 2000);
});

//implementing sort 
let sorted = false
btnSort.addEventListener("click", function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  // console.log("sort");
  sorted = !sorted;
})

// flatMap
const accMovements = accounts.flatMap(acc => acc.movements).reduce((acc, curr) => acc + curr, 0);
console.log(accMovements);

// from method
labelBalance.addEventListener("click", function(){
  const movementsUI = Array.from(document.querySelectorAll(".movements__value"), curr => Number(curr.textContent));
  // console.log(movementsUI.map(el => Number(el.textContent)));
  console.log(movementsUI);
});

// 🎯 Bankist application part 2
const labelDate = document.querySelector('.date');
 
// using remainder operator to color (nth)rows in movements 
// textBalance.addEventListener("click", function(){
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) =>{
//     // even rows
//     if(i % 2 === 0){
//       row.style.backgroundColor = 'rgb(250, 227, 231)';
//     }
//   });
// });

// DATES 
console.log(new Date(account1.movementsDates[0]));

// creating dates 
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = '100'; 
