"use strict";

// console.log(document.querySelector('.message').textContent);
// document.querySelector('.message').textContent = "correcr number 🎉";

// document.querySelector('.number').textContent = 0;
// document.querySelector('.score').textContent = 10;


// console.log(document.querySelector('.guess').value);
// document.querySelector('.guess').value = 23;

// const x = function () {
//     console.log(23);
// }

let secretnumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

function displaymessge(message) {
    document.querySelector('.message').textContent = message;

}
document.querySelector('.check').addEventListener('click', function () {
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess, typeof guess);

    // when there is no input 
    if (!guess) {
        // document.querySelector('.message').textContent = '⛔ No number!';
        displaymessge('⛔ No number!');

    }  // when player win the game 
    else if (guess === secretnumber) {
        // document.querySelector('.message').textContent = "correcr number 🎉";
        displaymessge("correcr number 🎉");

        document.querySelector('.number').textContent = secretnumber;
        // document.querySelector('.highscore').textContent = highscore;
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem';

        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }


    } // when gusses is wrong
    else if (guess !== secretnumber) {
        if (score > 1) {
            // document.querySelector('.message').textContent = guess > secretnumber ? "📈 Too High" : "📉 Too Low";
            displaymessge(guess > secretnumber ? "📈 Too High" : "📉 Too Low");
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            // document.querySelector('.message').textContent = "you lose the game!";
            displaymessge("you lose the game!");
            document.querySelector('.score').textContent = score;
        }
    }

    // when thwre is no input too hign
    // else if (guess > secretnumber) {
    //     if (score > 1) {
    //         document.querySelector('.message').textContent = "📈 Too High"
    //         score--;
    //         document.querySelector('.score').textContent = score;
    //     } else {
    //         document.querySelector('.message').textContent = "you lose the game!"
    //     }

    // } // when thwre is no input too low 
    // else if (secretnumber > guess) {
    //     if (score > 1) {
    //         document.querySelector('.message').textContent = "📉 Too Low";
    //         score--;
    //         document.querySelector('.score').textContent = score;
    //     } else {
    //         document.querySelector('.message').textContent = "you lose the game!"
    //     }
    //     // document.querySelector('.message').textContent = "📉 Too Low"
    //     // score--;
    //     // document.querySelector('.score').textContent = score;
    // }
})

document.querySelector('.again').addEventListener('click', function () {

    score = 20;
    secretnumber = Math.trunc(Math.random() * 20) + 1;
    // document.querySelector('.message').textContent = "Start Gusseing..";
    displaymessge('Start Gusseing..')
    document.querySelector('.score').textContent = 0;
    document.querySelector('.number').textContent = '?';
    document.querySelector('.guess').value = '';
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';


})
