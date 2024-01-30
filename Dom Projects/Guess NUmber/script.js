let randomval = Math.trunc(Math.random() * 100 + 1);
// console.log(randomval);
const submit = document.querySelector('#subt');
const userinput = document.querySelector('#guessField');
const guessnum = document.querySelector('.guesses');
const latinput = document.querySelector('.lastResult');
const lowhigh = document.querySelector('.lowOrHi');
const startover = document.querySelector('.resultParas');
const p = document.createElement('p');

let prevGuess = [];
let numguess = 1;

let playgame = true;

if (playgame) {
  submit.addEventListener('click', function (e) {
    e.preventDefault();
    const guess = Number(userinput.value);
    console.log(guess);
    validateguest(guess);
  });
}

function validateguest(guess) {
  if (isNaN(guess)) {
    alert('please enter a valiad number');
  } else if (guess < 1) {
    alert('please enter a number more than 1');
  } else if (guess > 100) {
    alert('please enter a number less than 100');
  } else {
    prevGuess.push(guess);
    if (numguess === 11) {
      displayguest(guess);
      displaymessage(`Game Over. Number was ${randomval}`);
      endgame();
    } else {
      displayguest(guess);
      checkguest(guess);
    }
  }
}

function checkguest(guess) {
  if (guess === randomval) {
    displaymessage('You Guess right 🎉');
    endgame();
  } else if (guess < randomval) {
    displaymessage(`Number is Tooo Low`);
  } else if (guess > randomval) {
    displaymessage(`Number is Tooo High`);
  }
}
function displayguest(guess) {
  // update the  empltystring
  userinput.value = '';
  guessnum.innerHTML += `${guess},`;
  numguess++;
  latinput.innerHTML = `${11 - numguess}`;
}
function displaymessage(message) {
  lowhigh.innerHTML = `<h3>${message}</h3>`;
}

function endgame() {
  userinput.value = '';
  userinput.setAttribute('disable', '');
  p.classList.add('button');
  p.innerHTML = `<h2 id="newgame"> Start Over </h2>`;
  startover.appendChild(p);
  playgame = false;
  newgame();
}

function newgame() {
  const newbutton = document.querySelector('#newgame');
  newbutton.addEventListener('click', function (e) {
    randomval =Math.trunc(Math.random() * 100 + 1);
    prevGuess = [];
    numguess = 1;
    guessnum.innerHTML = '';
    latinput.innerHTML = `${11 - numguess}`;
    userinput.removeAttribute('disable');
    startover.removeChild(p);

    playgame = true;
  });
}
